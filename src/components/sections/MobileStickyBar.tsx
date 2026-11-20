import { Button } from "@/components/ui/Button";
import { business } from "@/config/business";

/** Sticky bottom bar on mobile — replaces a floating WhatsApp bubble. */
export function MobileStickyBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-700 bg-ink-900 px-3 pt-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] sm:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
        <Button href="#book" className="min-h-12 w-full text-[1.05rem]">
          Book Now
        </Button>
        <Button
          href={`tel:${business.phone.tel}`}
          variant="outline"
          className="min-h-12 w-full text-[1.05rem]"
          aria-label={`Call ${business.phone.display}`}
        >
          Call
        </Button>
      </div>
    </nav>
  );
}
