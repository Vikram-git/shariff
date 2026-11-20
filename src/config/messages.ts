/**
 * Outgoing WhatsApp / system copy.
 * Keep all bot and template text here — never inline in handlers.
 */

export const messages = {
  bookingAck: (name: string, ref: string) =>
    `Thank you, ${name}. We received your booking ${ref}. We will confirm your slot shortly. Visiting charge is Rs 200, labour is extra based on the repair.`,
  skipFormWhatsApp:
    "Hello Shariff Appliances Service, I'd like to book a doorstep service.",
  keywordMenu:
    "How can we help?\n• Book a visit\n• Price\n• Areas",
  priceReply:
    "Visiting charge is Rs 200. Labour is extra, based on the repair.",
  areasReply:
    "We cover Ambattur, Avadi, Thirumullaivoyal, Pattabiram, Thiruninravur and Thiruverkadu. Not sure? Reply with your area.",
  outsideHours:
    "Thanks for messaging. We will reply in the morning during business hours.",
  /** Template text for Meta approval (Phase 4). */
  ownerAlertTemplate:
    "New booking {{1}}. {{2}} · {{3}} · {{4}}. Ref {{5}}.",
} as const;
