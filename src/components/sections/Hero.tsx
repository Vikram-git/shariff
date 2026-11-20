"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { ApplianceStackWatermark } from "@/components/ui/ApplianceIcons";
import { Hero3D } from "@/components/hero3d/Hero3D";
import { business } from "@/config/business";

export function Hero() {
  const [offset, setOffset] = useState(0);

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
    <section className="relative isolate min-h-[72svh] overflow-hidden md:min-h-[100svh]">
      <div className="absolute inset-0 z-0 pointer-events-none md:pointer-events-auto">
        <Hero3D />
      </div>

      {/* Keep copy readable; let the 3D chamber breathe on the right */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(5,8,9,0.72)_0%,rgba(5,8,9,0.42)_36%,rgba(5,8,9,0.88)_100%)] md:bg-[linear-gradient(90deg,rgba(5,8,9,0.78)_0%,rgba(5,8,9,0.35)_34%,transparent_68%)]"
        aria-hidden
      />

      <ApplianceStackWatermark
        className="pointer-events-none absolute -right-20 top-[12%] z-[1] hidden h-[min(80vw,640px)] w-auto text-slate-600 opacity-[0.1] md:block"
        style={watermarkStyle}
      />

      <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-6xl items-start px-5 pb-10 pt-7 md:min-h-[100svh] md:items-center md:px-6 md:pb-28 md:pt-28">
        <div className="w-full max-w-xl text-left">
          <p className="mb-2.5 text-[0.8rem] text-lime-400 md:hidden">
            Doorstep repair · Avadi & nearby
          </p>
          <h1 className="font-display text-[clamp(1.28rem,5.2vw,2.9rem)] leading-[1.3] text-silver-100">
            {business.taglines.hero}
          </h1>
          <p className="mt-3 max-w-[34ch] text-[0.92rem] leading-relaxed text-silver-300 sm:mt-4 sm:text-[1.0625rem]">
            {business.taglines.heroSub}
          </p>
          <div className="mt-5 flex w-full flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
            <Button href="#book" className="min-h-11 w-full sm:min-h-12 sm:w-auto">
              Book Now
            </Button>
            <Button
              href={`tel:${business.phone.tel}`}
              variant="outline"
              className="min-h-11 w-full sm:min-h-12 sm:w-auto"
            >
              Call {business.phone.display}
            </Button>
          </div>
          <p className="mt-4 hidden max-w-[42ch] text-sm text-silver-500 md:mt-5 md:block">
            Doorstep service in {business.serviceAreas.slice(0, -1).join(", ")}{" "}
            and {business.serviceAreas.at(-1)}.
          </p>
        </div>
      </div>
    </section>
  );
}
