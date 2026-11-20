import { Suspense } from "react";
import { BookingForm } from "@/components/sections/BookingForm";
import { business } from "@/config/business";

export function Booking() {
  return (
    <section id="book" className="scroll-mt-28 px-4 py-12 sm:scroll-mt-24 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-[20ch] font-display text-[clamp(1.25rem,5vw,2rem)] leading-snug text-silver-100">
          {business.taglines.booking}
        </h2>

        <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          <div className="relative rounded-[var(--radius-control)] border border-ink-700 bg-ink-800/50 px-4 py-6 sm:px-8 sm:py-8">
            <Suspense
              fallback={
                <p className="text-silver-500">Loading booking form…</p>
              }
            >
              <BookingForm />
            </Suspense>
          </div>

          <aside>
            <p className="text-sm text-silver-300">Have ready</p>
            <ul className="mt-4 space-y-3 text-silver-100">
              <li className="border-b border-ink-700 pb-3">
                Appliance model, if you know it
              </li>
              <li className="border-b border-ink-700 pb-3">
                A photo of the problem, if possible
              </li>
              <li className="border-b border-ink-700 pb-3">
                Your door number and landmark
              </li>
              <li>A preferred morning, afternoon or evening slot</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
