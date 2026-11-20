import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { business } from "@/config/business";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink-700 bg-ink-800 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-3">
        <div>
          <BrandLogo />
          <p className="mt-3 max-w-xs text-sm text-silver-500">
            {business.address.full}
          </p>
        </div>
        <div>
          <p className="text-sm text-silver-300">Contact</p>
          <a
            href={`tel:${business.phone.tel}`}
            className="mt-2 block text-sm text-silver-100 no-underline hover:text-lime-400"
          >
            {business.phone.display}
          </a>
          <a
            href={`https://wa.me/${business.phone.e164}`}
            className="mt-1 block text-sm text-silver-100 no-underline hover:text-lime-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
        <div>
          <p className="text-sm text-silver-300">Areas</p>
          <p className="mt-2 text-sm text-silver-500">
            {business.serviceAreas.join(", ")}
          </p>
          <Link
            href="/privacy"
            className="mt-4 inline-block text-sm text-silver-300 no-underline hover:text-lime-400"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
