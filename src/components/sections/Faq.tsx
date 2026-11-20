"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { business } from "@/config/business";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-20 px-4 py-9 sm:scroll-mt-24 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(1.2rem,4.8vw,2rem)] text-silver-100">
          Appliance service questions
        </h2>
        <p className="mt-2 max-w-[48ch] text-sm text-silver-500 sm:text-[1.0625rem]">
          Common questions about doorstep repair in Avadi and nearby Chennai.
        </p>
        <div className="mt-5 divide-y divide-ink-700 border-y border-ink-700 sm:mt-8">
          {business.faq.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex min-h-12 w-full items-center justify-between gap-3 py-3.5 text-left text-[0.95rem] text-silver-100 sm:min-h-14 sm:gap-4 sm:py-4 sm:text-[1.0625rem]"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="max-w-[50ch]">{item.q}</span>
                  <span className="shrink-0 text-lime-400" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[58ch] pb-4 text-sm leading-relaxed text-silver-500 sm:pb-5 sm:text-[1.0625rem]">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
