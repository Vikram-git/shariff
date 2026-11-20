import type { ServiceId } from "@/config/business";

export type BookingPreselect = {
  appliance?: ServiceId;
  problem?: string;
};

export function buildBookHref(preselect: BookingPreselect = {}): string {
  const params = new URLSearchParams();
  if (preselect.appliance) params.set("appliance", preselect.appliance);
  if (preselect.problem) params.set("problem", preselect.problem);
  const qs = params.toString();
  return qs ? `/?${qs}#book` : "/#book";
}

/** Hash-friendly parse: supports `#book?appliance=…&problem=…` and `?appliance=…#book`. */
export function readBookingPreselect(search: string): BookingPreselect {
  const params = new URLSearchParams(
    search.startsWith("?") ? search : search.includes("?") ? search.split("?")[1] : search,
  );
  const appliance = params.get("appliance") as ServiceId | null;
  const problem = params.get("problem");
  return {
    appliance: appliance || undefined,
    problem: problem || undefined,
  };
}
