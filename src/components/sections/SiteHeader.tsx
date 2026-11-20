"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";

const nav = [
  { href: "#services", label: "Services" },
  { href: "#price", label: "Price" },
  { href: "#areas", label: "Areas" },
  { href: "#faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <BrandLogo priority />
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center text-[0.95rem] text-silver-300 no-underline transition-colors hover:text-silver-100"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button href="#book" className="hidden sm:inline-flex">
          Book Now
        </Button>
      </div>

      {/* Mobile section jump links */}
      <nav
        aria-label="Sections"
        className="flex gap-1 overflow-x-auto border-t border-ink-700 px-3 py-1.5 scrollbar-none md:hidden"
      >
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="inline-flex min-h-10 shrink-0 items-center rounded-[var(--radius-control)] px-3 text-sm text-silver-300 no-underline active:bg-ink-700 active:text-silver-100"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
