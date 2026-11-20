"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { business } from "@/config/business";
import { FEATURES } from "@/config/features";

const AUTO_MS = 4500;

/**
 * Spin-cycle doorstep notes — laundry care tags tumbling through a washer drum.
 * Not attributed star reviews; swap in real testimonials when the owner confirms.
 */
export function Reviews() {
  if (!FEATURES.reviews) return null;
  return <ReviewsSpinCycle />;
}

function ReviewsSpinCycle() {
  const notes = business.doorstepNotes;
  const count = notes.length;
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [burst, setBurst] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  function goTo(next: number, direction: 1 | -1) {
    setDir(direction);
    setActive(((next % count) + count) % count);
    setBurst((n) => n + 1);
  }

  function step(direction: 1 | -1) {
    goTo(active + direction, direction);
  }

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setDir(1);
      setActive((i) => (i + 1) % count);
      setBurst((n) => n + 1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reduceMotion]);

  const current = notes[active];

  return (
    <section
      className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="pointer-events-none absolute -right-28 top-4 h-80 w-80 rounded-full border border-lime-400/15 animate-wash-spin-slow sm:h-[28rem] sm:w-[28rem]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-16 h-56 w-56 rounded-full border border-dashed border-lime-300/20 animate-wash-spin-rev sm:h-72 sm:w-72"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-8 top-28 h-40 w-40 rounded-full border border-lime-400/10 animate-wash-ripple sm:right-16"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-center lg:gap-14">
        <div>
          <h2 className="font-display text-[clamp(1.2rem,4.8vw,2rem)] text-silver-100">
            Doorstep notes
          </h2>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-snug text-silver-500 sm:text-[1.0625rem]">
            Short tags from recent visits across Avadi and nearby — spun like a
            wash cycle, not star ratings.
          </p>

          <div
            className="relative mt-8 min-h-[17rem] perspective-[1200px] sm:min-h-[19rem]"
            aria-live="polite"
            onTouchStart={(e) => {
              touchX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const start = touchX.current;
              const end = e.changedTouches[0]?.clientX;
              touchX.current = null;
              if (start == null || end == null) return;
              const delta = end - start;
              if (Math.abs(delta) < 40) return;
              step(delta < 0 ? 1 : -1);
            }}
          >
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.article
                key={current.id}
                custom={dir}
                variants={
                  reduceMotion
                    ? fadeOnly
                    : {
                        enter: (d: number) => ({
                          rotate: d * -28,
                          x: d * 120,
                          y: 40,
                          opacity: 0,
                          scale: 0.82,
                          rotateX: 18,
                        }),
                        center: {
                          rotate: 0,
                          x: 0,
                          y: 0,
                          opacity: 1,
                          scale: 1,
                          rotateX: 0,
                        },
                        exit: (d: number) => ({
                          rotate: d * 32,
                          x: d * -140,
                          y: -24,
                          opacity: 0,
                          scale: 0.78,
                          rotateX: -12,
                        }),
                      }
                }
                initial="enter"
                animate="center"
                exit="exit"
                transition={
                  reduceMotion
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 260, damping: 22, mass: 0.9 }
                }
                className="absolute inset-x-0 top-0 mx-auto w-full max-w-md origin-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                <CareTag
                  care={current.care}
                  appliance={current.appliance}
                  area={current.area}
                  note={current.note}
                  spinning={!reduceMotion}
                />
              </motion.article>
            </AnimatePresence>

            {/* Ghost stack behind for depth */}
            {!reduceMotion ? (
              <>
                <div
                  className="pointer-events-none absolute inset-x-0 top-3 mx-auto h-[85%] w-[92%] max-w-md -rotate-3 rounded-[var(--radius-sticker)] border border-mint-50/15 bg-mint-50/5"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-[80%] w-[88%] max-w-md rotate-2 rounded-[var(--radius-sticker)] border border-mint-50/10 bg-mint-50/5"
                  aria-hidden
                />
              </>
            ) : null}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] border border-ink-700 text-silver-100 transition-colors duration-150 active:border-lime-400 active:scale-[0.97]"
              aria-label="Previous note"
            >
              Prev
            </button>
            <div
              className="flex flex-1 items-center justify-center gap-1.5"
              role="tablist"
              aria-label="Doorstep notes"
            >
              {notes.map((note, index) => (
                <button
                  key={note.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`${note.appliance} in ${note.area}`}
                  onClick={() => goTo(index, index > active ? 1 : -1)}
                  className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ${
                    index === active
                      ? "w-7 bg-lime-400"
                      : "w-2.5 bg-ink-700 active:bg-lime-300"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => step(1)}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] border border-ink-700 text-silver-100 transition-colors duration-150 active:border-lime-400 active:scale-[0.97]"
              aria-label="Next note"
            >
              Next
            </button>
          </div>
        </div>

        <aside className="relative mx-auto w-full max-w-xs lg:mx-0 lg:justify-self-end">
          <DrumPreview
            label={current.appliance}
            area={current.area}
            care={current.care}
            burst={burst}
            reduceMotion={!!reduceMotion}
            onSpin={() => step(1)}
          />
        </aside>
      </div>
    </section>
  );
}

const fadeOnly = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

function CareTag({
  care,
  appliance,
  area,
  note,
  spinning,
}: {
  care: string;
  appliance: string;
  area: string;
  note: string;
  spinning: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-sticker)] border border-lime-400/45 bg-mint-50 px-5 pb-5 pt-4 text-ink-900 shadow-[0_18px_40px_color-mix(in_srgb,var(--ink-950)_42%,transparent)] ${
        spinning ? "animate-wash-wobble" : ""
      }`}
    >
      <div
        className="absolute left-1/2 top-0 h-3 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-700 bg-ink-800"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full border border-lime-500/20 animate-wash-spin-slow"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 border-b border-dashed border-silver-300 pb-3">
        <div>
          <p className="font-display text-[0.72rem] tracking-wide text-ink-700">
            Shariff care
          </p>
          <p className="mt-1 text-sm font-medium text-ink-900">{appliance}</p>
        </div>
        <div className="text-right">
          <motion.p
            key={care}
            initial={spinning ? { rotate: -12, opacity: 0, y: 6 } : false}
            animate={{ rotate: 0, opacity: 1, y: 0 }}
            className="font-display text-lg leading-none text-lime-500"
          >
            {care}
          </motion.p>
          <p className="mt-1 text-xs text-slate-600">{area}</p>
        </div>
      </div>
      <p className="mt-4 text-[0.95rem] leading-snug text-ink-800">{note}</p>
    </div>
  );
}

function DrumPreview({
  label,
  area,
  care,
  burst,
  reduceMotion,
  onSpin,
}: {
  label: string;
  area: string;
  care: string;
  burst: number;
  reduceMotion: boolean;
  onSpin: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSpin}
      className="group relative mx-auto block w-full max-w-[17rem] text-left active:scale-[0.98] transition-transform duration-150"
      aria-label="Spin to the next doorstep note"
    >
      <motion.div
        key={burst}
        initial={reduceMotion ? false : { rotate: 0 }}
        animate={
          reduceMotion
            ? undefined
            : { rotate: [0, 18, -10, 6, 0] }
        }
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={reduceMotion ? undefined : "animate-wash-wobble"}
      >
        <svg
          viewBox="0 0 200 240"
          className="h-auto w-full text-lime-400"
          fill="none"
        >
          <rect
            x="24"
            y="12"
            width="152"
            height="216"
            rx="14"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-80"
          />
          <path
            d="M24 52h152"
            stroke="currentColor"
            strokeWidth="2.5"
            opacity="0.7"
          />
          <circle
            cx="52"
            cy="32"
            r="7"
            fill="currentColor"
            className="animate-wash-pulse"
            opacity="0.5"
          />
          <circle cx="78" cy="32" r="7" fill="currentColor" opacity="0.28" />
          <path
            d="M108 32h48"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.35"
          />
          <circle
            cx="100"
            cy="140"
            r="72"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-90"
          />
          <circle
            cx="100"
            cy="140"
            r="66"
            stroke="currentColor"
            strokeWidth="1"
            className="animate-wash-ripple opacity-40"
            style={{ transformOrigin: "100px 140px" }}
          />
          <circle
            cx="100"
            cy="140"
            r="58"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="animate-wash-spin-rev opacity-45"
            style={{ transformOrigin: "100px 140px" }}
          />
          {/* Bubbles inside drum */}
          <circle
            cx="82"
            cy="160"
            r="4"
            fill="currentColor"
            className="animate-wash-bubble"
            style={{ animationDelay: "0s" }}
          />
          <circle
            cx="118"
            cy="168"
            r="3"
            fill="currentColor"
            className="animate-wash-bubble"
            style={{ animationDelay: "0.8s" }}
          />
          <circle
            cx="98"
            cy="178"
            r="3.5"
            fill="currentColor"
            className="animate-wash-bubble"
            style={{ animationDelay: "1.4s" }}
          />
          <g
            className="animate-wash-spin"
            style={{ transformOrigin: "100px 140px" }}
          >
            <path
              d="M100 92v48M100 140l28 24M100 140l-28 24"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
            />
            <path
              d="M100 188v-18M72 112l14 12M128 112l-14 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />
            <circle cx="100" cy="140" r="8" fill="currentColor" />
          </g>
        </svg>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${care}-${label}`}
          initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.94 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-x-8 bottom-10 rounded-[var(--radius-control)] bg-ink-900/85 px-3 py-2 text-center backdrop-blur-sm"
        >
          <p className="font-display text-xs text-lime-300">{care}</p>
          <p className="mt-0.5 text-sm text-silver-100">{label}</p>
          <p className="text-xs text-silver-500">{area}</p>
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
