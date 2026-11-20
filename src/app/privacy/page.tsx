import type { Metadata } from "next";
import { business } from "@/config/business";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${business.name} uses the details you share when booking a visit.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-[clamp(1.5rem,3vw,2rem)] text-silver-100">
        Privacy
      </h1>
      <div className="mt-6 space-y-4 text-silver-300">
        <p>
          We use the details you submit on this site only to schedule your
          doorstep visit and to contact you about that booking.
        </p>
        <p>
          Name, phone number and address may be stored so we can confirm your
          slot and so you do not have to re-type them next time. We do not sell
          your information.
        </p>
        <p>
          Bookings open WhatsApp so you can message {business.name} directly.
          WhatsApp&apos;s own privacy policy applies to that conversation.
        </p>
        <p>
          Questions: call or WhatsApp{" "}
          <a
            href={`tel:${business.phone.tel}`}
            className="text-lime-400 no-underline hover:underline"
          >
            {business.phone.display}
          </a>
          .
        </p>
      </div>
    </article>
  );
}
