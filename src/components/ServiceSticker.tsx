import type { ReactNode } from "react";

type Field = {
  label: string;
  value: ReactNode;
};

type ServiceStickerProps = {
  title: string;
  figure: ReactNode;
  fields?: Field[];
  footer?: ReactNode;
  className?: string;
};

/**
 * Signature motif: a service tag technicians stick on machines.
 * Used only for the price block and booking confirmation.
 */
export function ServiceSticker({
  title,
  figure,
  fields = [],
  footer,
  className = "",
}: ServiceStickerProps) {
  return (
    <aside
      className={`relative mx-auto w-full max-w-sm origin-center rounded-[var(--radius-sticker)] border border-ink-700 bg-ink-900 px-4 pb-5 pt-6 text-left shadow-none sm:mx-0 sm:-rotate-[1.5deg] sm:px-5 ${className}`}
      aria-label={title}
    >
      {/* Punched hole */}
      <span
        className="absolute left-1/2 top-2.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-slate-600 bg-ink-950"
        aria-hidden
      />
      {/* Perforation rule */}
      <span
        className="absolute inset-x-4 top-8 border-t border-dashed border-ink-700"
        aria-hidden
      />

      <p className="mt-4 text-sm text-silver-500">{title}</p>
      <div className="mt-2 font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-none text-gradient-wordmark">
        {figure}
      </div>

      {fields.length > 0 ? (
        <dl className="mt-5 space-y-2 border-t border-ink-700 pt-4">
          {fields.map((field) => (
            <div key={field.label} className="flex justify-between gap-4 text-sm">
              <dt className="text-silver-500">{field.label}</dt>
              <dd className="text-right text-silver-100">{field.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {footer ? <div className="mt-4 text-sm text-silver-300">{footer}</div> : null}

      {/* Lime accent strip — sticker motif only */}
      <span
        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-lime-400"
        aria-hidden
      />
    </aside>
  );
}
