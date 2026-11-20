/** Dark hero placeholder — no logo (avoids a huge emblem flash on refresh). */
export function Poster({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-ink-900 ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_70%_45%,#2C3640_0%,#0A0E0F_70%)]" />
    </div>
  );
}
