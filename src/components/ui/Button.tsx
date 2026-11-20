import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

type Common = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonAsButton = Common &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = Common &
  Omit<ComponentPropsWithoutRef<"a">, "className" | "children" | "href"> & {
    href: string;
  };

const variants: Record<Variant, string> = {
  primary:
    "bg-wordmark text-ink-950 font-medium hover:brightness-105 focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--lime-400)_55%,transparent),0_0_24px_color-mix(in_srgb,var(--lime-400)_45%,transparent)] active:bg-lime-500 active:bg-none",
  outline:
    "border border-slate-600 bg-transparent text-silver-100 hover:border-lime-400",
  ghost: "bg-transparent text-silver-300 hover:text-silver-100",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] px-5 text-[1rem] transition-[filter,border-color,color,box-shadow] duration-150 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-11";

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, variant = "primary", className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    const external = href.startsWith("http") || href.startsWith("tel:");
    if (external) {
      return (
        <a href={href} className={classes} {...linkRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonAsButton;
  return (
    <button type={buttonRest.type ?? "button"} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
