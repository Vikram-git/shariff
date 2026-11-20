type WashSpinnerProps = {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-8 w-8",
  md: "h-16 w-16",
  lg: "h-24 w-24",
} as const;

/** Front-load washing machine with a spinning drum — used for loading states. */
export function WashSpinner({
  label = "Loading",
  className = "",
  size = "md",
}: WashSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <svg
        viewBox="0 0 80 96"
        className={`${sizes[size]} animate-wash-wobble text-lime-400`}
        fill="none"
        aria-hidden
      >
        <rect
          x="8"
          y="4"
          width="64"
          height="88"
          rx="6"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M8 22h64" stroke="currentColor" strokeWidth="2" />
        <circle
          cx="22"
          cy="13"
          r="3.5"
          fill="currentColor"
          className="animate-wash-pulse"
          opacity="0.55"
        />
        <circle cx="34" cy="13" r="3.5" fill="currentColor" opacity="0.35" />
        <path
          d="M48 13h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.45"
        />
        <circle
          cx="40"
          cy="58"
          r="26"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <circle
          cx="40"
          cy="58"
          r="23"
          stroke="currentColor"
          strokeWidth="1"
          className="animate-wash-ripple"
          style={{ transformOrigin: "40px 58px" }}
          opacity="0.35"
        />
        <circle
          cx="40"
          cy="58"
          r="20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          className="animate-wash-spin-rev"
          style={{ transformOrigin: "40px 58px" }}
          opacity="0.45"
        />
        {/* Bubbles */}
        <circle
          cx="34"
          cy="66"
          r="2.2"
          fill="currentColor"
          className="animate-wash-bubble"
          style={{ animationDelay: "0s" }}
        />
        <circle
          cx="46"
          cy="70"
          r="1.6"
          fill="currentColor"
          className="animate-wash-bubble"
          style={{ animationDelay: "0.7s" }}
        />
        <circle
          cx="40"
          cy="74"
          r="1.9"
          fill="currentColor"
          className="animate-wash-bubble"
          style={{ animationDelay: "1.3s" }}
        />
        <g className="animate-wash-spin" style={{ transformOrigin: "40px 58px" }}>
          <path
            d="M40 42v16M40 58l12 10M40 58l-12 10"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
          />
          <path
            d="M40 74v-6M28 48l6 5M52 48l-6 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.45"
          />
          <circle cx="40" cy="58" r="4" fill="currentColor" />
        </g>
      </svg>
      <span className="text-sm text-silver-500">{label}</span>
    </div>
  );
}
