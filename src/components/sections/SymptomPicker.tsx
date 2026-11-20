"use client";

import { business, type ServiceId } from "@/config/business";
import { buildBookHref } from "@/lib/booking-preselect";

type Chip = {
  label: string;
  appliance: ServiceId;
  problem: string;
};

const chips: Chip[] = [
  { label: "Not draining", appliance: "washing-machine", problem: "Not draining" },
  { label: "Not cooling", appliance: "refrigerator", problem: "Not cooling" },
  { label: "Leaking water", appliance: "washing-machine", problem: "Leaking water" },
  { label: "Making noise", appliance: "washing-machine", problem: "Making noise" },
  { label: "Won't start", appliance: "dishwasher", problem: "Won't start" },
  { label: "Ice build-up", appliance: "refrigerator", problem: "Ice build-up" },
  { label: "Dishes not clean", appliance: "dishwasher", problem: "Dishes not clean" },
  { label: "Noisy compressor", appliance: "refrigerator", problem: "Noisy compressor" },
];

export function SymptomPicker() {
  return (
    <section className="py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="px-4 sm:px-0">
          <h2 className="font-display text-[clamp(1.15rem,4.5vw,1.6rem)] text-silver-100">
            What&apos;s wrong?
          </h2>
          <p className="mt-2 max-w-[42ch] text-sm text-silver-500">
            Tap a symptom to start booking.
          </p>
        </div>

        {/* Horizontal scroll on mobile — less wrap clutter */}
        <ul className="mt-5 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mt-6 sm:flex-wrap sm:overflow-visible sm:px-0">
          {chips.map((chip) => (
            <li key={`${chip.appliance}-${chip.label}`} className="shrink-0">
              <a
                href={buildBookHref({
                  appliance: chip.appliance,
                  problem: chip.problem,
                })}
                className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] border border-ink-700 bg-ink-800/40 px-3.5 text-sm text-silver-300 no-underline active:border-lime-400 active:text-silver-100"
              >
                {chip.label}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-4 px-4 text-sm text-silver-500 sm:px-0">
          Not listed? We still cover{" "}
          {business.services.map((s) => s.name.toLowerCase()).join(", ")}.
        </p>
      </div>
    </section>
  );
}
