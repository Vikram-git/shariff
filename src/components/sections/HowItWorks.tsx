import { business } from "@/config/business";

export function HowItWorks() {
  return (
    <section className="px-4 py-9 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(1.2rem,4.8vw,2rem)] text-silver-100">
          How it works
        </h2>
        <ol className="mt-5 space-y-0 sm:mt-8 sm:max-w-2xl sm:space-y-5">
          {business.howItWorks.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 border-b border-ink-700 py-3.5 last:border-b-0 sm:gap-4 sm:border-0 sm:py-0"
            >
              <span
                className="font-display text-sm text-lime-400 tabular-nums sm:text-[1rem]"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-[0.95rem] leading-snug text-silver-100 sm:text-[1.0625rem] sm:leading-relaxed">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
