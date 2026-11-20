export function SkipLink() {
  return (
    <a
      href="#main"
      className="absolute left-4 top-4 z-[100] -translate-y-16 rounded-[var(--radius-control)] bg-wordmark px-4 py-3 text-ink-950 opacity-0 transition-none focus:translate-y-0 focus:opacity-100 focus:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--lime-400)_55%,transparent)]"
    >
      Skip to main content
    </a>
  );
}
