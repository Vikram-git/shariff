"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ServiceId } from "@/config/business";
import { Poster } from "./Poster";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => <Poster />,
  },
);

function detectLowPower(): boolean {
  if (typeof window === "undefined") return true;
  const cores = navigator.hardwareConcurrency || 4;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  return cores <= 4 || narrow;
}

function detectReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function Hero3D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  const [lowPower, setLowPower] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    setLowPower(detectLowPower());
    setReducedMotion(detectReducedMotion());

    if (!detectWebGL()) {
      setFailed(true);
      return;
    }

    const start = () => setReady(true);
    const ric = (
      window as Window & {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number },
        ) => number;
      }
    ).requestIdleCallback;

    if (ric) {
      const id = ric(start, { timeout: 1200 });
      return () => {
        (
          window as Window & {
            cancelIdleCallback?: (id: number) => void;
          }
        ).cancelIdleCallback?.(id);
      };
    }

    const t = window.setTimeout(start, 200);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0;
        setVisible(ratio >= 0.05);
      },
      { threshold: [0, 0.05, 0.1, 0.25, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onSelectAppliance = useCallback((id: ServiceId) => {
    const row = document.getElementById("services");
    row?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.dispatchEvent(
      new CustomEvent("sas:expand-service", { detail: { id } }),
    );
  }, []);

  const onError = useCallback(() => setFailed(true), []);

  return (
    <div ref={rootRef} className="absolute inset-0 h-full w-full" aria-hidden>
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          ready && !failed && visible ? "opacity-0" : "opacity-100"
        }`}
      >
        <Poster />
      </div>

      {ready && !failed ? (
        <div className="absolute inset-0">
          <HeroCanvas
            lowPower={lowPower}
            reducedMotion={reducedMotion}
            visible={visible}
            onSelectAppliance={onSelectAppliance}
            onError={onError}
          />
        </div>
      ) : null}
    </div>
  );
}
