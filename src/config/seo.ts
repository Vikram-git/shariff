import { business } from "@/config/business";

/**
 * SEO copy and keyword targets — local appliance service (Avadi / Chennai).
 * Keep claims aligned with business.ts; no invented ratings or reviews.
 */

export const seo = {
  titleDefault:
    "Appliance Service in Avadi, Chennai | Shariff Appliances Service",
  titleTemplate: `%s | ${business.shortName} Appliances Service`,
  description: `Doorstep appliance service in Avadi, Ambattur and nearby Chennai. Washing machine, refrigerator and dishwasher repair. Visiting charge Rs ${business.visitingChargeInr}. Call ${business.phone.display}.`,
  ogTitle: "Shariff Appliances Service | Doorstep repair in Avadi, Chennai",
  ogDescription: `Book doorstep washing machine, fridge and dishwasher service across ${business.serviceAreas.join(", ")}.`,
  keywords: [
    "appliance service",
    "appliance service Avadi",
    "appliance service Chennai",
    "appliance repair Avadi",
    "appliance repair Chennai",
    "washing machine repair Avadi",
    "washing machine service Chennai",
    "refrigerator repair Avadi",
    "fridge service Ambattur",
    "dishwasher repair Chennai",
    "doorstep appliance service",
    "home appliance service near me",
    "Shariff Appliances Service",
    ...business.serviceAreas.flatMap((area) => [
      `appliance service ${area}`,
      `appliance repair ${area}`,
      `washing machine repair ${area}`,
    ]),
  ],
  /** Short on-page intro — readable, keyword-natural */
  introHeading: "Appliance service across Avadi and nearby Chennai",
  introBody: `Shariff Appliances Service offers doorstep repair for washing machines, refrigerators and dishwashers in ${business.serviceAreas.join(", ")}. Book online or WhatsApp ${business.phone.display}. Visiting charge is Rs ${business.visitingChargeInr}; labour is told after checking the appliance.`,
} as const;
