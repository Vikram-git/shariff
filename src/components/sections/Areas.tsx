import { business } from "@/config/business";

export function Areas() {
  return (
    <section id="areas" className="scroll-mt-28 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(1.35rem,3vw,2rem)] text-silver-100">
          Areas we cover
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {business.serviceAreas.map((area) => {
            const isBase = area === business.baseArea;
            return (
              <li
                key={area}
                className="flex min-h-11 items-center justify-between border-b border-ink-700 py-3 text-silver-100"
              >
                <span>{area}</span>
                {isBase ? (
                  <span className="text-sm text-lime-400">Base</span>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-6 max-w-[48ch] text-sm text-silver-500">
          Not on the list? Message us on WhatsApp and we will tell you if we can
          come.
        </p>
      </div>
    </section>
  );
}
