import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";

type BrandLogoProps = {
  priority?: boolean;
  className?: string;
};

/**
 * Logo renders unmodified — no recolour, stretch, blend, or effects.
 * Emblem is a transparent PNG; name is crisp CSS text.
 */
export function BrandLogo({ priority = false, className = "" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex min-w-0 items-center gap-2 no-underline sm:gap-2.5 ${className}`}
      aria-label={`${business.name} home`}
    >
      <Image
        src="/brand/emblem-header.png"
        alt=""
        width={48}
        height={48}
        priority={priority}
        unoptimized
        className="h-9 w-9 shrink-0 bg-ink-900 object-contain sm:h-12 sm:w-12"
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="font-display text-[0.9rem] tracking-[0.04em] text-gradient-wordmark sm:text-[1.05rem]">
          {business.shortName}
        </span>
        <span className="truncate text-[0.65rem] font-medium tracking-[0.04em] text-silver-100 sm:text-[0.75rem] sm:tracking-[0.06em]">
          Appliances Service
        </span>
      </span>
    </Link>
  );
}
