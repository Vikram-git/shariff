import { z } from "zod";
import { business } from "@/config/business";

const serviceIds = business.services.map((s) => s.id) as [
  (typeof business.services)[number]["id"],
  ...(typeof business.services)[number]["id"][],
];

const areas = [
  ...business.serviceAreas,
  "Other",
] as unknown as [string, ...string[]];

const slotIds = business.visitSlots.map((s) => s.id) as [
  (typeof business.visitSlots)[number]["id"],
  ...(typeof business.visitSlots)[number]["id"][],
];

const indianMobile = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .refine(
    (v) => /^(?:\+?91)?[6-9]\d{9}$/.test(v),
    "Enter a 10-digit Indian mobile starting with 6 to 9",
  );

export const bookingFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters)"),
  phone: indianMobile,
  appliance: z.enum(serviceIds, {
    message: "Choose an appliance",
  }),
  applianceType: z.string().trim(),
  brand: z.string().trim(),
  problem: z.string().trim(),
  problemNotes: z.string().trim(),
  area: z.enum(areas, { message: "Choose your area" }),
  address: z
    .string()
    .trim()
    .min(10, "Enter your full address (door number, street, landmark)"),
  preferredDate: z
    .string()
    .trim()
    .min(1, "Choose a preferred day"),
  slot: z.enum(slotIds, { message: "Choose a visit slot" }),
  /** Honeypot — must stay empty */
  company: z.string().max(0, "Invalid submission"),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const bookingApiSchema = bookingFormSchema.extend({
  ref: z
    .string()
    .regex(/^SAS-[A-HJ-NP-Z2-9]{6}$/, "Invalid booking reference"),
});

export type BookingApiPayload = z.infer<typeof bookingApiSchema>;

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const ten = digits.length >= 10 ? digits.slice(-10) : digits;
  return `+91${ten}`;
}

export function problemSummary(values: {
  problem?: string;
  problemNotes?: string;
}): string {
  const parts = [values.problem, values.problemNotes]
    .map((p) => p?.trim())
    .filter(Boolean);
  return parts.join(" — ") || "Not sure, please check";
}
