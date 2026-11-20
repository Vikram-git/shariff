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
    <section className="px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(1.2rem,2.5vw,1.6rem)] text-silver-100">
          What&apos;s wrong?
        </h2>
        <p className="mt-2 max-w-[42ch] text-sm text-silver-500">
          Tap a symptom to jump to booking with that problem ready.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <li key={`${chip.appliance}-${chip.label}`}>
              <a
                href={buildBookHref({
                  appliance: chip.appliance,
                  problem: chip.problem,
                })}
                className="inline-flex min-h-12 items-center rounded-[var(--radius-control)] border border-ink-700 px-3.5 text-sm text-silver-300 no-underline transition-colors hover:border-lime-400 hover:text-silver-100 sm:min-h-11"
              >
                {chip.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-silver-500">
          Not listed? Book for any {business.services.map((s) => s.name.toLowerCase()).join(", ")}.
        </p>
      </div>
    </section>
  );
}
