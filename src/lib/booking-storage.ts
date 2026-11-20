const KEY = "sas-booking-customer";

export type StoredCustomer = {
  name: string;
  phone: string;
  address: string;
};

export function loadStoredCustomer(): StoredCustomer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCustomer;
    if (!parsed?.name || !parsed?.phone) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredCustomer(data: StoredCustomer): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // ignore quota / private mode
  }
}
