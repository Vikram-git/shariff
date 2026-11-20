import { business } from "@/config/business";
import { seo } from "@/config/seo";

/**
 * Crawlable local SEO intro — natural language, facts from business config.
 */
export function SeoIntro() {
  return (
    <section
      id="appliance-service"
      className="scroll-mt-20 border-y border-ink-700 bg-ink-900/70 px-4 py-9 sm:scroll-mt-24 sm:px-6 sm:py-12"
      aria-labelledby="seo-intro-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="seo-intro-heading"
          className="font-display text-[clamp(1.15rem,4vw,1.75rem)] leading-snug text-silver-100"
        >
          {seo.introHeading}
        </h2>
        <p className="mt-3 max-w-[62ch] text-[0.95rem] leading-relaxed text-silver-300 sm:text-[1.0625rem]">
          {seo.introBody}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {business.services.map((service) => (
            <li key={service.id}>
              <a
                href="#services"
                className="inline-flex min-h-10 items-center rounded-[var(--radius-control)] border border-ink-700 bg-ink-800 px-3 text-sm text-silver-100 no-underline hover:border-lime-400"
              >
                {service.name} service
              </a>
            </li>
          ))}
          {business.serviceAreas.slice(0, 4).map((area) => (
            <li key={area}>
              <a
                href="#areas"
                className="inline-flex min-h-10 items-center rounded-[var(--radius-control)] border border-ink-700 px-3 text-sm text-silver-300 no-underline hover:border-lime-400 hover:text-silver-100"
              >
                Appliance repair {area}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
