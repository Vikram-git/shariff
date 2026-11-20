import type { ComponentPropsWithoutRef, ReactNode } from "react";

const controlClass =
  "min-h-12 w-full rounded-[var(--radius-control)] border border-ink-700 bg-ink-900 px-3 text-[1rem] text-silver-100 placeholder:text-silver-500 focus-visible:border-lime-400 sm:min-h-11";

export function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm text-silver-300">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-sm text-silver-500">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-alert" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      {...props}
      className={`${controlClass} min-h-24 py-2 ${props.className ?? ""}`}
    />
  );
}

export function Select(props: ComponentPropsWithoutRef<"select">) {
  return <select {...props} className={`${controlClass} ${props.className ?? ""}`} />;
}

export { controlClass };
