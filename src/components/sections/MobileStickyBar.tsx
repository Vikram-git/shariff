import { Button } from "@/components/ui/Button";
import { business } from "@/config/business";

/** Sticky bottom bar on mobile — primary actions always in thumb reach. */
export function MobileStickyBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-700 bg-ink-900/95 px-4 pt-2.5 pb-[max(0.55rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2.5">
        <Button href="#book" className="min-h-11 w-full font-medium">
          Book Now
        </Button>
        <Button
          href={`tel:${business.phone.tel}`}
          variant="outline"
          className="min-h-11 w-full font-medium"
          aria-label={`Call ${business.phone.display}`}
        >
          Call
        </Button>
      </div>
    </nav>
  );
}
