import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getServiceSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export type BookingRow = {
  ref: string;
  name: string;
  phone: string;
  appliance: string;
  appliance_type: string | null;
  brand: string | null;
  problem: string | null;
  area: string;
  address: string;
  preferred_date: string;
  slot: string;
  status?: string;
  source?: string;
};
