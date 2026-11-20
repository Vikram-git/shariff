import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";

type BrandLogoProps = {
  priority?: boolean;
  className?: string;
};

export function BrandLogo({ priority = false, className = "" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex min-w-0 items-center gap-2 no-underline ${className}`}
      aria-label={`${business.name} home`}
    >
      <Image
        src="/brand/emblem-header.png"
        alt=""
        width={40}
        height={40}
        priority={priority}
        unoptimized
        className="h-8 w-8 shrink-0 object-contain sm:h-11 sm:w-11"
      />
      <span className="flex min-w-0 flex-col leading-[1.15]">
        <span className="font-display text-[0.85rem] tracking-[0.03em] text-gradient-wordmark sm:text-[1.05rem] sm:tracking-[0.04em]">
          {business.shortName}
        </span>
        <span className="text-[0.62rem] font-medium text-silver-100 sm:text-[0.75rem]">
          Appliances Service
        </span>
      </span>
    </Link>
  );
}
