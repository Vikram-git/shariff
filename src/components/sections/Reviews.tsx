"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ApplianceIcon } from "@/components/ui/ApplianceIcons";
import { business, type ServiceId } from "@/config/business";
import { FEATURES } from "@/config/features";

const AUTO_MS = 5200;

type Note = (typeof business.doorstepNotes)[number];

/**
 * Doorstep visit tickets — cinematic featured story + snap rail.
 * Not attributed star reviews; swap in real testimonials when confirmed.
 */
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

  // Track when the section is on screen — autoplay only needs visibility, not page scrolling
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

  // Independent autoplay timer — never uses scrollIntoView (that was tying motion to page scroll)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollRailTo reads latest refs
  }, [count, reduceMotion, inView]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-12 sm:py-16"
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_80%_20%,color-mix(in_srgb,var(--lime-400)_14%,transparent),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full border border-lime-400/10 animate-wash-spin-slow md:h-80 md:w-80"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-[clamp(1.25rem,4.8vw,2rem)] text-silver-100">
              From the doorstep
            </h2>
            <p className="mt-3 text-[0.95rem] leading-snug text-silver-500 sm:text-[1.0625rem]">
              Real visit notes from Avadi and nearby — written like job tickets,
              not star ratings.
            </p>
          </div>
          <p className="hidden text-sm text-silver-500 md:block">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </p>
        </div>

        {/* Featured ticket — desktop + mobile hero card */}
        <div className="mt-8 lg:mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 28, scale: 0.97 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -18, scale: 0.98 }
              }
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : { type: "spring", stiffness: 280, damping: 26 }
              }
            >
              <FeatureTicket note={current} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Snap rail — unique tilted mini tickets, not a uniform grid */}
        <div className="mt-6 sm:mt-8">
          <div
            ref={scrollerRef}
            className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:gap-4 sm:px-6 lg:gap-5"
            role="tablist"
            aria-label="Doorstep visit notes"
          >
            {notes.map((note, index) => {
              const tilt =
                index % 3 === 0 ? "-rotate-1" : index % 3 === 1 ? "rotate-1" : "rotate-0";
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
                  className={`relative w-[78vw] max-w-[18rem] shrink-0 snap-center text-left transition-[transform,opacity] duration-200 sm:w-[16rem] md:w-[17.5rem] ${tilt} ${
                    selected
                      ? "z-[1] scale-[1.03]"
                      : "opacity-75 active:opacity-100"
                  }`}
                >
                  <MiniTicket note={note} selected={selected} />
                </button>
              );
            })}
          </div>

          <div
            className="mt-5 flex items-center justify-center gap-1.5 lg:mt-6"
            aria-hidden
          >
            {notes.map((note, index) => (
              <span
                key={`dot-${note.id}`}
                className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ${
                  index === active ? "w-8 bg-lime-400" : "w-2.5 bg-ink-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureTicket({ note }: { note: Note }) {
  return (
    <article className="relative overflow-hidden rounded-[1.1rem] border border-lime-400/35 bg-[linear-gradient(145deg,var(--mint-50)_0%,var(--lime-200)_100%)] text-ink-900 shadow-[0_28px_60px_color-mix(in_srgb,var(--ink-950)_45%,transparent)]">
      {/* Perforation + punch */}
      <div className="relative border-b border-dashed border-ink-700/25 px-5 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-6">
        <span
          className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-700 bg-ink-900"
          aria-hidden
        />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-[0.68rem] tracking-[0.14em] text-ink-700">
              Shariff visit ticket
            </p>
            <p className="mt-2 font-display text-[clamp(1.15rem,3.6vw,1.85rem)] leading-tight text-ink-900">
              {note.headline}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CareStamp care={note.care} />
            <AreaStamp area={note.area} />
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative px-5 py-5 sm:px-8 sm:py-7">
          <ApplianceIcon
            id={note.serviceId as ServiceId}
            className="pointer-events-none absolute -right-2 -top-2 h-36 w-36 text-lime-500/20 sm:h-44 sm:w-44"
          />
          <p className="relative max-w-[36ch] text-[1.05rem] leading-relaxed text-ink-800 sm:text-[1.2rem] sm:leading-relaxed">
            {note.note}
          </p>
          <div className="relative mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border border-ink-700/20 bg-ink-900/5 px-3 py-2 text-sm text-ink-800">
              <ApplianceIcon
                id={note.serviceId as ServiceId}
                className="h-5 w-5 text-lime-500"
              />
              {note.appliance}
            </span>
            <span className="rounded-[var(--radius-control)] bg-ink-900 px-3 py-2 text-sm text-lime-300">
              {note.outcome}
            </span>
          </div>
        </div>

        <div className="relative flex min-h-[11rem] items-end overflow-hidden border-t border-dashed border-ink-700/20 bg-ink-900 px-5 py-5 text-silver-100 sm:min-h-[14rem] sm:px-7 sm:py-7 lg:border-l lg:border-t-0">
          <Motif serviceId={note.serviceId as ServiceId} />
          <div className="relative z-[1]">
            <p className="font-display text-[0.7rem] tracking-[0.12em] text-lime-300">
              Area covered
            </p>
            <p className="mt-2 font-display text-[clamp(1.4rem,4vw,2rem)] leading-none">
              {note.area}
            </p>
            <p className="mt-3 max-w-[22ch] text-sm text-silver-500">
              Doorstep service — check, explain labour, repair on site.
            </p>
          </div>
        </div>
      </div>

      <span
        className="absolute bottom-0 left-6 right-6 h-1 rounded-full bg-wordmark"
        aria-hidden
      />
    </article>
  );
}

function MiniTicket({ note, selected }: { note: Note; selected: boolean }) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-[var(--radius-sticker)] border px-4 pb-4 pt-5 transition-[border-color,box-shadow,background-color] duration-200 ${
        selected
          ? "border-lime-400 bg-ink-800 shadow-[0_12px_28px_color-mix(in_srgb,var(--ink-950)_35%,transparent)]"
          : "border-ink-700 bg-ink-800/70"
      }`}
    >
      <span
        className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-600 bg-ink-950"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs text-silver-500">{note.appliance}</p>
          <p className="mt-1 font-display text-[0.95rem] leading-snug text-silver-100">
            {note.area}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-[var(--radius-control)] px-2 py-1 font-display text-[0.65rem] ${
            selected
              ? "bg-wordmark text-ink-950"
              : "border border-ink-700 text-lime-400"
          }`}
        >
          {note.care}
        </span>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-snug text-silver-300">
        {note.headline}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-ink-700 pt-3">
        <ApplianceIcon
          id={note.serviceId as ServiceId}
          className={`h-7 w-7 ${selected ? "text-lime-400" : "text-silver-500"}`}
        />
        <span className="truncate text-xs text-silver-500">{note.outcome}</span>
      </div>
    </div>
  );
}

function CareStamp({ care }: { care: string }) {
  return (
    <div className="flex h-14 w-14 rotate-3 items-center justify-center rounded-full border-2 border-lime-500/70 bg-lime-200/40">
      <span className="font-display text-[0.72rem] leading-none text-lime-500">
        {care}
      </span>
    </div>
  );
}

function AreaStamp({ area }: { area: string }) {
  return (
    <div className="-rotate-2 rounded-[var(--radius-control)] border border-dashed border-ink-700/35 bg-ink-900/5 px-3 py-2">
      <p className="text-[0.65rem] text-ink-700">Near</p>
      <p className="font-display text-sm text-ink-900">{area}</p>
    </div>
  );
}

function Motif({ serviceId }: { serviceId: ServiceId }) {
  if (serviceId === "washing-machine") {
    return (
      <div
        className="pointer-events-none absolute right-[-10%] top-1/2 h-44 w-44 -translate-y-1/2 rounded-full border border-lime-400/30 animate-wash-spin-slow sm:h-56 sm:w-56"
        aria-hidden
      >
        <div className="absolute inset-6 rounded-full border border-dashed border-lime-300/25 animate-wash-spin-rev" />
        <div className="absolute inset-[30%] rounded-full bg-lime-400/15 animate-wash-pulse" />
      </div>
    );
  }
  if (serviceId === "refrigerator") {
    return (
      <div
        className="pointer-events-none absolute inset-y-4 right-4 w-24 opacity-40 sm:w-32"
        aria-hidden
      >
        <div className="h-full rounded-[var(--radius-control)] border border-lime-400/35">
          <div className="mt-[42%] border-t border-lime-400/35" />
        </div>
      </div>
    );
  }
  return (
    <div
      className="pointer-events-none absolute bottom-6 right-4 left-1/2 space-y-3 opacity-35"
      aria-hidden
    >
      <div className="h-1.5 w-3/4 rounded-full bg-lime-400/50" />
      <div className="h-1.5 w-2/3 rounded-full bg-lime-300/40" />
      <div className="h-1.5 w-4/5 rounded-full bg-lime-400/45" />
    </div>
  );
}
