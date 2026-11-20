"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { business } from "@/config/business";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-28 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-[clamp(1.35rem,3vw,2rem)] text-silver-100">
          Questions
        </h2>
        <div className="mt-8 divide-y divide-ink-700 border-y border-ink-700">
          {business.faq.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-silver-100"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span className="max-w-[50ch]">{item.q}</span>
                  <span className="text-lime-400" aria-hidden>
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
                      <p className="max-w-[58ch] pb-5 text-silver-500">{item.a}</p>
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
