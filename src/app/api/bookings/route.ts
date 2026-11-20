import { NextResponse } from "next/server";
import {
  bookingApiSchema,
  normalizePhone,
  problemSummary,
} from "@/lib/booking-schema";
import { allowBookingRequest } from "@/lib/ratelimit";
import { getServiceSupabase } from "@/lib/supabase";

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const allowed = await allowBookingRequest(ip);
    if (!allowed) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Wait a minute and try again." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = bookingApiSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message || "Invalid booking details",
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.company && data.company.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const phone = normalizePhone(data.phone);
    const problem = problemSummary({
      problem: data.problem,
      problemNotes: data.problemNotes,
    });

    const supabase = getServiceSupabase();
    if (!supabase) {
      console.info("[bookings] Supabase not configured — booking accepted locally", {
        ref: data.ref,
        appliance: data.appliance,
        area: data.area,
      });
      return NextResponse.json({ ok: true, ref: data.ref });
    }

    const { error } = await supabase.from("bookings").insert({
      ref: data.ref,
      name: data.name,
      phone,
      appliance: data.appliance,
      appliance_type: data.applianceType || null,
      brand: data.brand || null,
      problem,
      area: data.area,
      address: data.address,
      preferred_date: data.preferredDate,
      slot: data.slot,
      status: "new",
      source: "web",
    });

    if (error) {
      console.error("[bookings] insert failed", error.message);
      // Still ok for the client — WhatsApp already carries the order
      return NextResponse.json({ ok: true, ref: data.ref, stored: false });
    }

    return NextResponse.json({ ok: true, ref: data.ref, stored: true });
  } catch (err) {
    console.error("[bookings] unexpected", err);
    return NextResponse.json({ ok: true });
  }
}
