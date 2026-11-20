import type { CSSProperties } from "react";
import type { ServiceId } from "@/config/business";

type IconProps = {
  className?: string;
  style?: CSSProperties;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function WashingMachineIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect x="7" y="5" width="26" height="30" rx="2" {...stroke} />
      <circle cx="20" cy="21" r="8" {...stroke} />
      <circle cx="20" cy="21" r="4.5" {...stroke} />
      <circle cx="12" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M24 9.5h5" {...stroke} />
    </svg>
  );
}

export function RefrigeratorIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect x="10" y="3" width="20" height="34" rx="2" {...stroke} />
      <path d="M10 17h20" {...stroke} />
      <path d="M14 8v5" {...stroke} />
      <path d="M14 21v6" {...stroke} />
      <path d="M12 37v2M28 37v2" {...stroke} />
    </svg>
  );
}

export function DishwasherIcon({ className = "h-10 w-10" }: IconProps) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect x="6" y="6" width="28" height="28" rx="2" {...stroke} />
      <path d="M6 13h28" {...stroke} />
      <path d="M10 9.5h8" {...stroke} />
      <circle cx="28" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 20h16M12 25h12M12 30h14" {...stroke} />
    </svg>
  );
}

const map = {
  "washing-machine": WashingMachineIcon,
  refrigerator: RefrigeratorIcon,
  dishwasher: DishwasherIcon,
} as const;

export function ApplianceIcon({
  id,
  className,
}: {
  id: ServiceId;
  className?: string;
}) {
  const Icon = map[id];
  return <Icon className={className} />;
}

/** Oversized line-art stack for the hero watermark. */
export function ApplianceStackWatermark({ className = "", style }: IconProps) {
  return (
    <svg
      viewBox="0 0 280 320"
      className={className}
      style={style}
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      {/* Dishwasher — low left */}
      <g transform="translate(8 170)">
        <rect x="0" y="0" width="110" height="100" rx="4" />
        <path d="M0 22h110" />
        <path d="M14 11h36" />
        <circle cx="90" cy="11" r="3" />
        <path d="M20 46h70M20 64h55M20 82h62" />
      </g>
      {/* Washing machine — middle */}
      <g transform="translate(70 70)">
        <rect x="0" y="0" width="120" height="150" rx="4" />
        <circle cx="60" cy="85" r="38" />
        <circle cx="60" cy="85" r="22" />
        <circle cx="22" cy="18" r="4" />
        <circle cx="38" cy="18" r="4" />
        <path d="M70 18h30" />
      </g>
      {/* Refrigerator — tall right */}
      <g transform="translate(160 10)">
        <rect x="0" y="0" width="100" height="240" rx="4" />
        <path d="M0 90h100" />
        <path d="M18 28v36" />
        <path d="M18 120v48" />
        <path d="M16 240v10M84 240v10" />
      </g>
    </svg>
  );
}
