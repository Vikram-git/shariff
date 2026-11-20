"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ApplianceIcon } from "@/components/ui/ApplianceIcons";
import { business, type ServiceId } from "@/config/business";
import { FEATURES } from "@/config/features";

const AUTO_MS = 5200;

type Note = (typeof business.doorstepNotes)[number];

/** Simple light visit notes — autoplay, no heavy motion chrome. */
export function Reviews() {
  if (!FEATURES.reviews) return null;
  return <ReviewsTickets />;
}

function ReviewsTickets() {
  const notes = business.doorstepNotes;
  const count = notes.length;
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0);

  const current = notes[active]!;

  function scrollRailTo(index: number) {
    const scroller = scrollerRef.current;
    const card = cardRefs.current[index];
    if (!scroller || !card) return;
    const left =
      card.offsetLeft - (scroller.clientWidth - card.offsetWidth) / 2;
    scroller.scrollTo({
      left: Math.max(0, left),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  function goTo(index: number) {
    const next = ((index % count) + count) % count;
    activeRef.current = next;
    setActive(next);
    scrollRailTo(next);
  }

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(!!entry?.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || !inView) return;

    let cancelled = false;
    let timeoutId = 0;

    const tick = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        const next = (activeRef.current + 1) % count;
        activeRef.current = next;
        setActive(next);
        scrollRailTo(next);
        tick();
      }, AUTO_MS);
    };

    tick();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reduceMotion, inView]);

  return (
    <section ref={sectionRef} className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(1.25rem,4.8vw,2rem)] text-silver-100">
              From the doorstep
            </h2>
            <p className="mt-3 text-[0.95rem] leading-snug text-silver-500 sm:text-[1.0625rem]">
              Visit notes from Avadi and nearby — not star ratings.
            </p>
          </div>
          <p className="hidden text-sm text-silver-500 md:block">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(count).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={current.id}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.28 }}
              className="relative overflow-hidden rounded-[1.1rem] border border-ink-700 bg-ink-900 px-5 py-5 sm:px-8 sm:py-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-silver-500">{current.appliance}</p>
                  <h3 className="mt-1 font-display text-[clamp(1.1rem,3vw,1.55rem)] leading-snug text-silver-100">
                    {current.headline}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-[var(--radius-control)] border border-ink-700 px-2.5 py-1 font-display text-xs text-lime-500">
                    {current.care}
                  </span>
                  <span className="rounded-[var(--radius-control)] bg-mint-50 px-2.5 py-1 text-xs text-silver-300">
                    {current.area}
                  </span>
                </div>
              </div>

              <p className="relative mt-5 max-w-[42ch] text-[1.02rem] leading-relaxed text-silver-300">
                {current.note}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-sm text-silver-500">
                  <ApplianceIcon
                    id={current.serviceId as ServiceId}
                    className="h-5 w-5 text-lime-500"
                  />
                  {current.outcome}
                </span>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div
          ref={scrollerRef}
          className="scrollbar-none -mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-4 sm:px-6"
          role="tablist"
          aria-label="Doorstep visit notes"
        >
          {notes.map((note, index) => {
            const selected = index === active;
            return (
              <button
                key={note.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => goTo(index)}
                className={`w-[72vw] max-w-[16.5rem] shrink-0 snap-center rounded-[var(--radius-sticker)] border px-4 py-4 text-left transition-[border-color,background-color,opacity] duration-200 sm:w-[15rem] ${
                  selected
                    ? "border-lime-400 bg-ink-900"
                    : "border-ink-700 bg-ink-800/80 opacity-80"
                }`}
              >
                <p className="text-xs text-silver-500">{note.appliance}</p>
                <p className="mt-1 font-display text-sm text-silver-100">
                  {note.area}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-snug text-silver-300">
                  {note.headline}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5" aria-hidden>
          {notes.map((note, index) => (
            <span
              key={`dot-${note.id}`}
              className={`h-2 rounded-full transition-[width,background-color] duration-300 ${
                index === active ? "w-7 bg-lime-400" : "w-2 bg-ink-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
