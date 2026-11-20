import { HeroVisual } from "@/components/sections/HeroVisual";
import { business } from "@/config/business";

/** Full-bleed hero with light 3D photo motion and short copy. */
export function Hero() {
  return (
    <section className="relative isolate min-h-[70svh] overflow-hidden md:min-h-[88svh]">
      <HeroVisual />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(100deg,color-mix(in_srgb,var(--mint-50)_90%,transparent)_0%,color-mix(in_srgb,var(--mint-50)_52%,transparent)_40%,transparent_70%)] md:bg-[linear-gradient(90deg,color-mix(in_srgb,var(--mint-50)_94%,transparent)_0%,color-mix(in_srgb,var(--mint-50)_48%,transparent)_44%,transparent_74%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-6xl items-end px-5 pb-10 pt-8 md:min-h-[88svh] md:items-center md:px-6 md:pb-24 md:pt-20">
        <div className="w-full max-w-md text-left">
          <h1 className="font-display text-[clamp(1.4rem,4.8vw,2.75rem)] leading-[1.25] text-silver-100">
            {business.taglines.hero}
          </h1>
          <p className="mt-3 max-w-[28ch] text-[0.95rem] leading-relaxed text-silver-300 sm:text-[1.05rem]">
            {business.taglines.heroSub}
          </p>
        </div>
      </div>

    </section>
  );
}
