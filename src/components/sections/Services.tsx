"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ApplianceIcon } from "@/components/ui/ApplianceIcons";
import { Button } from "@/components/ui/Button";
import { business, type ServiceId } from "@/config/business";
import { buildBookHref } from "@/lib/booking-preselect";

const weight: Record<ServiceId, string> = {
  "washing-machine": "border-l-lime-400 py-7 sm:py-9",
  refrigerator: "border-l-emerald-400 py-9 sm:py-11",
  dishwasher: "border-l-slate-600 py-6 sm:py-8",
};

export function Services() {
  const [openId, setOpenId] = useState<ServiceId | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<
    Partial<Record<ServiceId, string>>
  >({});

  useEffect(() => {
    const onExpand = (event: Event) => {
      const detail = (event as CustomEvent<{ id: ServiceId }>).detail;
      if (detail?.id) setOpenId(detail.id);
    };
    window.addEventListener("sas:expand-service", onExpand);
    return () => window.removeEventListener("sas:expand-service", onExpand);
  }, []);

  return (
    <section id="services" className="scroll-mt-28 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-[18ch] font-display text-[clamp(1.25rem,5vw,2rem)] leading-snug text-silver-100">
          {business.taglines.services}
        </h2>
        <p className="mt-3 max-w-[48ch] text-sm text-silver-500 sm:text-[1.0625rem]">
          Washing machines, refrigerators and dishwashers. All types of service.
        </p>

        <div className="mt-8 divide-y divide-ink-700 border-y border-ink-700 sm:mt-10">
          {business.services.map((service) => {
            const open = openId === service.id;
            const problem = selectedProblem[service.id];

            return (
              <article
                key={service.id}
                className={`border-l-2 pl-3 sm:pl-6 ${weight[service.id]}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex gap-3 sm:gap-4">
                    <span className="mt-1 shrink-0 text-lime-400">
                      <ApplianceIcon id={service.id} className="h-10 w-10 sm:h-11 sm:w-11" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[clamp(1.05rem,4vw,1.45rem)] text-silver-100">
                        {service.name}
                      </h3>
                      <p className="mt-2 max-w-[52ch] text-sm text-silver-500">
                        {service.types.join(" · ")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="min-h-12 w-full rounded-[var(--radius-control)] border border-ink-700 px-4 text-sm text-silver-300 transition-colors hover:border-slate-600 hover:text-silver-100 sm:w-auto sm:min-h-11 sm:self-start"
                    aria-expanded={open}
                    aria-controls={`service-panel-${service.id}`}
                    onClick={() => setOpenId(open ? null : service.id)}
                  >
                    {open ? "Hide problems" : "Common problems"}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={`service-panel-${service.id}`}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-1 pt-5">
                        <ul className="flex flex-wrap gap-2">
                          {service.problems.map((item) => {
                            const active = problem === item;
                            return (
                              <li key={item}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProblem((prev) => ({
                                      ...prev,
                                      [service.id]: item,
                                    }))
                                  }
                                  className={`min-h-11 rounded-[var(--radius-control)] border px-3.5 text-sm transition-colors ${
                                    active
                                      ? "border-lime-400 bg-ink-700 text-silver-100"
                                      : "border-ink-700 text-silver-300 hover:border-slate-600"
                                  }`}
                                >
                                  {item}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="mt-5">
                          <Button
                            href={buildBookHref({
                              appliance: service.id,
                              problem,
                            })}
                          >
                            Book this
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
