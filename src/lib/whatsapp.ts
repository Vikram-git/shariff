import { business } from "@/config/business";
import { messages } from "@/config/messages";

export type BookingPayload = {
  ref: string;
  name: string;
  phone: string;
  appliance: string;
  applianceType?: string;
  brand?: string;
  problem?: string;
  area: string;
  address: string;
  dateLabel: string;
  slotLabel: string;
};

export function buildWhatsAppUrl(b: BookingPayload): string {
  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || business.phone.e164;

  const lines = [
    "Hello Shariff Appliances Service, I'd like to book a doorstep service.",
    "",
    `Booking ID: ${b.ref}`,
    `Name: ${b.name}`,
    `Phone: ${b.phone}`,
    `Appliance: ${b.appliance}${b.applianceType ? ` (${b.applianceType})` : ""}`,
    b.brand ? `Brand: ${b.brand}` : "",
    `Problem: ${b.problem || "Not sure, please check"}`,
    `Area: ${b.area}`,
    `Address: ${b.address}`,
    `Preferred visit: ${b.dateLabel}, ${b.slotLabel}`,
  ].filter((l, i) => l !== "" || i === 1);

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildSkipFormWhatsAppUrl(): string {
  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || business.phone.e164;
  return `https://wa.me/${number}?text=${encodeURIComponent(messages.skipFormWhatsApp)}`;
}

export function openWhatsApp(url: string): void {
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (mobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank", "noopener");
  }
}
