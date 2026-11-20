import { business } from "@/config/business";

export function Areas() {
  return (
    <section
      id="areas"
      className="scroll-mt-20 px-4 py-9 sm:scroll-mt-24 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(1.2rem,4.8vw,2rem)] text-silver-100">
          Areas we cover
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
          {business.serviceAreas.map((area) => {
            const isBase = area === business.baseArea;
            return (
              <li
                key={area}
                className={`flex min-h-12 items-center justify-between rounded-[var(--radius-control)] border px-3 text-sm sm:min-h-11 sm:rounded-none sm:border-0 sm:border-b sm:border-ink-700 sm:px-0 sm:py-3 sm:text-[1.0625rem] ${
                  isBase
                    ? "border-lime-400/40 bg-ink-800/60 text-silver-100"
                    : "border-ink-700 bg-ink-800/30 text-silver-100 sm:bg-transparent"
                }`}
              >
                <span className="truncate">{area}</span>
                {isBase ? (
                  <span className="ml-2 shrink-0 text-xs text-lime-400 sm:text-sm">
                    Base
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-5 max-w-[48ch] text-sm text-silver-500">
          Not on the list? Message us on WhatsApp and we will tell you if we can
          come.
        </p>
      </div>
    </section>
  );
}
