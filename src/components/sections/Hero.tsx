"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { ApplianceStackWatermark } from "@/components/ui/ApplianceIcons";
import { Hero3D } from "@/components/hero3d/Hero3D";
import { business } from "@/config/business";

export function Hero() {
  const [offset, setOffset] = useState(0);
  const areasLine = `Doorstep service in ${business.serviceAreas.slice(0, -1).join(", ")} and ${business.serviceAreas.at(-1)}.`;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setOffset(window.scrollY * 0.04);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const watermarkStyle: CSSProperties = {
    transform: `translate3d(0, ${offset}px, 0)`,
  };

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Full-bleed 3D — no pointer capture on mobile so scroll/taps work */}
      <div className="absolute inset-0 z-0 pointer-events-none md:pointer-events-auto">
        <Hero3D />
      </div>

      {/* Stronger scrim on mobile (vertical); side fade on desktop */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(5,8,9,0.55)_0%,rgba(5,8,9,0.72)_42%,rgba(5,8,9,0.92)_100%)] md:bg-[linear-gradient(90deg,rgba(5,8,9,0.82)_0%,rgba(5,8,9,0.45)_38%,transparent_72%)]"
        aria-hidden
      />

      <ApplianceStackWatermark
        className="pointer-events-none absolute -right-20 top-[12%] z-[1] hidden h-[min(80vw,640px)] w-auto text-slate-600 opacity-[0.1] md:block"
        style={watermarkStyle}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-end px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-24 md:items-center md:px-6 md:pb-28 md:pt-28">
        <div className="w-full max-w-xl text-left">
          <h1 className="font-display text-[clamp(1.45rem,6.2vw,2.9rem)] leading-[1.22] text-silver-100">
            {business.taglines.hero}
          </h1>
          <p className="mt-3 max-w-[36ch] text-[0.95rem] text-silver-300 sm:mt-4 sm:text-[1.0625rem]">
            {business.taglines.heroSub}
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button href="#book" className="w-full min-h-12 sm:w-auto">
              Book Now
            </Button>
            <Button
              href={`tel:${business.phone.tel}`}
              variant="outline"
              className="w-full min-h-12 sm:w-auto"
            >
              <span className="sm:hidden">Call {business.phone.display}</span>
              <span className="hidden sm:inline">Call {business.phone.display}</span>
            </Button>
          </div>
          <p className="mt-4 max-w-[42ch] text-sm text-silver-500 sm:mt-5">
            {areasLine}
          </p>
        </div>
      </div>
    </section>
  );
}
