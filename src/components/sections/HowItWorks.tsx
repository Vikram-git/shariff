import { business } from "@/config/business";

export function HowItWorks() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(1.35rem,3vw,2rem)] text-silver-100">
          How it works
        </h2>
        <ol className="mt-8 max-w-2xl space-y-5">
          {business.howItWorks.map((step, index) => (
            <li key={step} className="flex gap-4">
              <span
                className="font-display text-lime-400 tabular-nums"
                aria-hidden
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-silver-100">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
