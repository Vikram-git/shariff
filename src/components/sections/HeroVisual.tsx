"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Full-bleed hero photo with light 3D tilt + float. */
export function HeroVisual() {
  const root = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(true);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current = { x: nx, y: ny };
    };

    const tick = () => {
      const el = root.current;
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;

      if (el) {
        const t = performance.now() / 1000;
        const floatY = Math.sin(t * 0.7) * 6;
        const floatR = Math.sin(t * 0.45) * 0.4;
        const rotY = current.current.x * 5 + floatR;
        const rotX = -current.current.y * 3.5;
        const tx = current.current.x * -12;
        const ty = current.current.y * -8 + floatY;
        el.style.transform = `perspective(1200px) translate3d(${tx}px, ${ty}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [reduceMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden={!reduceMotion}>
      {/* Depth plate behind the photo */}
      <div
        className="absolute inset-[-4%] rounded-[0] bg-lime-200/40"
        style={{ transform: "translateZ(-40px)" }}
      />
      <div
        ref={root}
        className="absolute inset-[-3%] will-change-transform"
        style={{
          transform: "perspective(1200px) scale(1.04)",
          transformStyle: "preserve-3d",
        }}
      >
        <Image
          src="/brand/hero.jpg"
          alt="Appliance service in Avadi — washing machine, refrigerator and dishwasher"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Soft gloss edge for a card-in-space feel */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--ink-900)_35%,transparent)_0%,transparent_42%,color-mix(in_srgb,var(--ink-950)_8%,transparent)_100%)]"
          aria-hidden
        />
      </div>
    </div>
  );
}
