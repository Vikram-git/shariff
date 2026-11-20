import { WashSpinner } from "@/components/ui/WashSpinner";

/** Dark hero placeholder with washing-machine spinner while 3D loads. */
export function Poster({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-ink-900 ${className}`}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(55%_50%_at_70%_45%,#2C3640_0%,#0A0E0F_70%)]"
        aria-hidden
      />
      <WashSpinner label="Loading appliances" size="lg" className="relative z-[1]" />
    </div>
  );
}
