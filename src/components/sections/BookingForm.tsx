"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { track } from "@vercel/analytics";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ServiceSticker } from "@/components/ServiceSticker";
import { Button } from "@/components/ui/Button";
import { Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import { WashSpinner } from "@/components/ui/WashSpinner";
import { business, type ServiceId } from "@/config/business";
import { generateBookingRef } from "@/lib/booking-ref";
import {
  bookingFormSchema,
  problemSummary,
  type BookingFormValues,
} from "@/lib/booking-schema";
import { readBookingPreselect } from "@/lib/booking-preselect";
import {
  loadStoredCustomer,
  saveStoredCustomer,
} from "@/lib/booking-storage";
import {
  buildSkipFormWhatsAppUrl,
  buildWhatsAppUrl,
  openWhatsApp,
} from "@/lib/whatsapp";

const STEPS = [
  { id: 1, label: "Appliance and problem" },
  { id: 2, label: "Where and when" },
  { id: 3, label: "Your details" },
] as const;

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(iso: string): string {
  if (iso === todayISO()) return "Today";
  if (iso === addDaysISO(1)) return "Tomorrow";
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function applianceLabel(id: ServiceId): string {
  return business.services.find((s) => s.id === id)?.name ?? id;
}

export function BookingForm() {
  const [step, setStep] = useState(1);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [dayMode, setDayMode] = useState<"today" | "tomorrow" | "pick">("today");
  const [today, setToday] = useState("");
  const [tomorrow, setTomorrow] = useState("");

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      appliance: "" as BookingFormValues["appliance"],
      applianceType: "",
      brand: "",
      problem: "",
      problemNotes: "",
      area: "" as BookingFormValues["area"],
      address: "",
      preferredDate: "",
      slot: "anytime",
      company: "",
    },
    mode: "onTouched",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const appliance = watch("appliance");
  const problem = watch("problem");
  const preferredDate = watch("preferredDate");

  const selectedService = useMemo(
    () => business.services.find((s) => s.id === appliance),
    [appliance],
  );

  useEffect(() => {
    const t = todayISO();
    const tm = addDaysISO(1);
    setToday(t);
    setTomorrow(tm);
    setValue("preferredDate", t);

    const stored = loadStoredCustomer();
    if (stored) {
      setValue("name", stored.name);
      setValue("phone", stored.phone);
      setValue("address", stored.address);
    }

    const pre = readBookingPreselect(window.location.search);
    if (pre.appliance) {
      setValue("appliance", pre.appliance, { shouldValidate: true });
    }
    if (pre.problem) {
      setValue("problem", pre.problem, { shouldValidate: true });
    }
  }, [setValue]);

  async function goNext() {
    const fieldsByStep: Record<number, (keyof BookingFormValues)[]> = {
      1: ["appliance", "applianceType", "brand", "problem", "problemNotes"],
      2: ["area", "address", "preferredDate", "slot"],
      3: ["name", "phone"],
    };
    const ok = await trigger(fieldsByStep[step] ?? []);
    if (ok) setStep((s) => Math.min(3, s + 1));
  }

  function onSubmit(values: BookingFormValues) {
    const ref = generateBookingRef();
    const slotLabel =
      business.visitSlots.find((s) => s.id === values.slot)?.label ?? values.slot;
    const dateLabel = formatDateLabel(values.preferredDate);
    const applianceName = applianceLabel(values.appliance);

    const payload = {
      ref,
      name: values.name,
      phone: values.phone,
      appliance: applianceName,
      applianceType: values.applianceType || undefined,
      brand: values.brand || undefined,
      problem: problemSummary(values),
      area: values.area,
      address: values.address,
      dateLabel,
      slotLabel,
    };

    const url = buildWhatsAppUrl(payload);

    // Synchronous open — must not await anything first
    openWhatsApp(url);

    saveStoredCustomer({
      name: values.name,
      phone: values.phone,
      address: values.address,
    });

    void fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ...values,
        ref,
      }),
    }).catch(() => {
      /* ignore — WhatsApp already carries the order */
    });

    try {
      track("booking_whatsapp_click", {
        appliance: values.appliance,
        area: values.area,
      });
    } catch {
      /* analytics optional */
    }

    setSuccessRef(ref);
  }

  if (successRef) {
    return (
      <div className="space-y-6">
        <ServiceSticker
          title="Booking received"
          figure={successRef}
          fields={[
            { label: "Next", value: "Send the WhatsApp message" },
            { label: "Then", value: "We confirm your slot" },
          ]}
          footer="If WhatsApp did not open, use the skip link below or call us."
        />
        <p className="text-silver-300">
          Visiting charge is Rs {business.visitingChargeInr}. Labour is extra,
          based on the repair.
        </p>
        <Button href={buildSkipFormWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
          Open WhatsApp again
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative space-y-6"
      noValidate
    >
      <ol className="flex gap-2" aria-label="Booking steps">
        {STEPS.map((s) => {
          const active = step === s.id;
          const done = step > s.id;
          const short =
            s.id === 1 ? "Appliance" : s.id === 2 ? "When" : "Details";
          return (
            <li key={s.id} className="min-w-0 flex-1">
              <div
                className={`h-1 rounded-full ${
                  active || done ? "bg-lime-400" : "bg-ink-700"
                }`}
              />
              <p
                className={`mt-2 text-xs sm:text-sm ${
                  active ? "text-silver-100" : "text-silver-500"
                }`}
              >
                <span className="sr-only">Step {s.id}: {s.label}</span>
                <span className="sm:hidden" aria-hidden>
                  {short}
                </span>
                <span className="hidden sm:inline" aria-hidden>
                  {s.label}
                </span>
              </p>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
          className="space-y-5"
        >
          {step === 1 ? (
            <>
              <Field
                label="Appliance"
                htmlFor="appliance"
                error={errors.appliance?.message}
              >
                <Select
                  id="appliance"
                  {...register("appliance")}
                  autoComplete="off"
                >
                  <option value="">Choose appliance</option>
                  {business.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </Field>

              {selectedService ? (
                <Field
                  label="Type"
                  htmlFor="applianceType"
                  error={errors.applianceType?.message}
                >
                  <Select id="applianceType" {...register("applianceType")}>
                    <option value="">Choose type</option>
                    {selectedService.types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : null}

              <Field label="Brand" htmlFor="brand" hint="Optional">
                <TextInput
                  id="brand"
                  list="brand-list"
                  autoComplete="off"
                  placeholder="e.g. LG, Samsung"
                  {...register("brand")}
                />
                <datalist id="brand-list">
                  {business.commonBrands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Field>

              {selectedService ? (
                <fieldset>
                  <legend className="mb-2 text-sm text-silver-300">Problem</legend>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.problems.map((p) => {
                      const active = problem === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() =>
                            setValue("problem", active ? "" : p, {
                              shouldDirty: true,
                            })
                          }
                          className={`min-h-11 rounded-[var(--radius-control)] border px-3.5 text-sm transition-colors ${
                            active
                              ? "border-lime-400 bg-ink-700 text-silver-100"
                              : "border-ink-700 text-silver-300 hover:border-slate-600"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}

              <Field
                label="Anything else about the problem"
                htmlFor="problemNotes"
                hint="Optional"
              >
                <TextArea
                  id="problemNotes"
                  rows={3}
                  placeholder="Describe what you notice"
                  {...register("problemNotes")}
                />
              </Field>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <Field label="Area" htmlFor="area" error={errors.area?.message}>
                <Select id="area" {...register("area")}>
                  <option value="">Choose area</option>
                  {business.serviceAreas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                      {a === business.baseArea ? " (base)" : ""}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </Select>
              </Field>

              <Field
                label="Full address"
                htmlFor="address"
                error={errors.address?.message}
                hint="Door number, street, landmark"
              >
                <TextArea
                  id="address"
                  rows={3}
                  autoComplete="street-address"
                  {...register("address")}
                />
              </Field>

              <fieldset>
                <legend className="mb-2 text-sm text-silver-300">
                  Preferred day
                </legend>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["today", "Today", today],
                      ["tomorrow", "Tomorrow", tomorrow],
                      ["pick", "Pick a date", preferredDate],
                    ] as const
                  ).map(([mode, label, iso]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setDayMode(mode);
                        if (mode !== "pick" && iso) {
                          setValue("preferredDate", iso, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      className={`min-h-11 rounded-[var(--radius-control)] border px-3.5 text-sm ${
                        dayMode === mode
                          ? "border-lime-400 bg-ink-700 text-silver-100"
                          : "border-ink-700 text-silver-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {dayMode === "pick" ? (
                  <div className="mt-3">
                    <TextInput
                      type="date"
                      id="preferredDate"
                      min={today || undefined}
                      {...register("preferredDate")}
                    />
                    {errors.preferredDate ? (
                      <p className="mt-1.5 text-sm text-alert" role="alert">
                        {errors.preferredDate.message}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <input type="hidden" {...register("preferredDate")} />
                )}
              </fieldset>

              <Field label="Slot" htmlFor="slot" error={errors.slot?.message}>
                <Controller
                  name="slot"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2" id="slot">
                      {business.visitSlots.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => field.onChange(s.id)}
                          className={`min-h-11 rounded-[var(--radius-control)] border px-3.5 text-sm ${
                            field.value === s.id
                              ? "border-lime-400 bg-ink-700 text-silver-100"
                              : "border-ink-700 text-silver-300"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                />
              </Field>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Field label="Your name" htmlFor="name" error={errors.name?.message}>
                <TextInput
                  id="name"
                  autoComplete="name"
                  {...register("name")}
                />
              </Field>

              <Field
                label="Mobile number"
                htmlFor="phone"
                error={errors.phone?.message}
              >
                <TextInput
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="99625 06148"
                  {...register("phone")}
                />
              </Field>
            </>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            className="min-h-12 w-full sm:w-auto"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            Back
          </Button>
        ) : null}

        {step < 3 ? (
          <Button
            type="button"
            className="min-h-12 w-full sm:w-auto"
            onClick={() => void goNext()}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            className="min-h-12 w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <WashSpinner
                size="sm"
                label="Booking"
                className="gap-2 py-0 text-ink-950 [&_span]:text-ink-950 [&_svg]:text-ink-950"
              />
            ) : (
              "Book Now"
            )}
          </Button>
        )}
      </div>

      <p className="text-sm text-silver-500">
        We use these details only to schedule your visit.{" "}
        <a href="/privacy" className="text-lime-400 no-underline hover:underline">
          Privacy
        </a>
      </p>

      <p className="text-sm">
        <a
          href={buildSkipFormWhatsAppUrl()}
          className="text-silver-300 no-underline hover:text-lime-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          Skip the form and chat on WhatsApp
        </a>
      </p>
    </form>
  );
}
