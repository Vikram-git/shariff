"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ApplianceIcon } from "@/components/ui/ApplianceIcons";
import { Button } from "@/components/ui/Button";
import { business, type ServiceId } from "@/config/business";
import { buildBookHref } from "@/lib/booking-preselect";

const weight: Record<ServiceId, string> = {
  "washing-machine": "border-l-lime-400",
  refrigerator: "border-l-emerald-400",
  dishwasher: "border-l-slate-600",
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
    <section
      id="services"
      className="scroll-mt-20 px-4 py-9 sm:scroll-mt-24 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-[16ch] font-display text-[clamp(1.2rem,4.8vw,2rem)] leading-snug text-silver-100">
          {business.taglines.services}
        </h2>
        <p className="mt-2 max-w-[48ch] text-sm text-silver-500 sm:mt-3 sm:text-[1.0625rem]">
          Washing machines, refrigerators and dishwashers. All types of service.
        </p>

        <div className="mt-6 divide-y divide-ink-700 border-y border-ink-700 sm:mt-10">
          {business.services.map((service) => {
            const open = openId === service.id;
            const problem = selectedProblem[service.id];

            return (
              <article
                key={service.id}
                className={`border-l-2 py-4 pl-3 sm:py-8 sm:pl-6 ${weight[service.id]}`}
              >
                <button
                  type="button"
                  className="flex w-full items-start gap-3 text-left sm:gap-4"
                  aria-expanded={open}
                  aria-controls={`service-panel-${service.id}`}
                  onClick={() => setOpenId(open ? null : service.id)}
                >
                  <span className="mt-0.5 shrink-0 text-lime-400">
                    <ApplianceIcon
                      id={service.id}
                      className="h-9 w-9 sm:h-11 sm:w-11"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-[clamp(1rem,3.8vw,1.45rem)] text-silver-100">
                        {service.name}
                      </span>
                      <span
                        className="mt-0.5 shrink-0 text-lime-400"
                        aria-hidden
                      >
                        {open ? "−" : "+"}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-sm text-silver-500">
                      {service.types.filter((t) => !t.startsWith("Other")).join(" · ")}
                    </span>
                  </span>
                </button>

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
                      <div className="pb-1 pt-4 sm:pt-5">
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
                                  className={`min-h-11 rounded-[var(--radius-control)] border px-3 text-sm transition-colors ${
                                    active
                                      ? "border-lime-400 bg-ink-700 text-silver-100"
                                      : "border-ink-700 text-silver-300"
                                  }`}
                                >
                                  {item}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="mt-4">
                          <Button
                            href={buildBookHref({
                              appliance: service.id,
                              problem,
                            })}
                            className="min-h-12 w-full sm:w-auto"
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
