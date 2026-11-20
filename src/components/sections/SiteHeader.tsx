import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { business } from "@/config/business";

const nav = [
  { href: "#services", label: "Services" },
  { href: "#price", label: "Price" },
  { href: "#areas", label: "Areas" },
  { href: "#faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
        <BrandLogo priority />

        <div className="flex items-center gap-2">
          {/* Mobile: call icon only — Book lives in the bottom bar */}
          <a
            href={`tel:${business.phone.tel}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-ink-700 text-silver-100 no-underline active:border-lime-400 md:hidden"
            aria-label={`Call ${business.phone.display}`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
          </a>

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

          <span className="hidden md:inline-flex">
            <Button href="#book">Book Now</Button>
          </span>
        </div>
      </div>
    </header>
  );
}
