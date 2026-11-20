import { Suspense } from "react";
import { BookingForm } from "@/components/sections/BookingForm";
import { business } from "@/config/business";

const readyItems = [
  "Appliance model, if you know it",
  "A photo of the problem, if possible",
  "Your door number and landmark",
  "A preferred morning, afternoon or evening slot",
] as const;

export function Booking() {
  return (
    <section
      id="book"
      className="scroll-mt-20 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-[18ch] font-display text-[clamp(1.2rem,4.8vw,2rem)] leading-snug text-silver-100">
          {business.taglines.booking}
        </h2>

        {/* Mobile: compact checklist above the form */}
        <details className="mt-5 rounded-[var(--radius-control)] border border-ink-700 bg-ink-800/40 px-4 py-3 lg:hidden">
          <summary className="cursor-pointer text-sm text-silver-300">
            What to have ready
          </summary>
          <ul className="mt-3 space-y-2 text-sm text-silver-100">
            {readyItems.map((item) => (
              <li key={item} className="border-b border-ink-700 pb-2 last:border-0">
                {item}
              </li>
            ))}
          </ul>
        </details>

        <div className="mt-5 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <div className="relative rounded-[var(--radius-control)] border border-ink-700 bg-ink-800/50 px-3.5 py-5 sm:px-8 sm:py-8">
            <Suspense
              fallback={
                <p className="text-silver-500">Loading booking form…</p>
              }
            >
              <BookingForm />
            </Suspense>
          </div>

          <aside className="hidden lg:block">
            <p className="text-sm text-silver-300">Have ready</p>
            <ul className="mt-4 space-y-3 text-silver-100">
              {readyItems.map((item) => (
                <li key={item} className="border-b border-ink-700 pb-3 last:border-0">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
