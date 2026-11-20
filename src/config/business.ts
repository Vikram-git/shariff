/**
 * Single source of truth for Shariff Appliances Service.
 * Every page and component reads from here. Do not hard-code facts elsewhere.
 */

export const business = {
  name: "Shariff Appliances Service",
  shortName: "Shariff",
  address: {
    line1: "11/10, Kumaran Nagar 6th Cross Street",
    line2: "Kamaraj Nagar, Avadi, Chennai",
    /** TODO_CONFIRM with owner */
    pincode: "600071",
    full: "11/10, Kumaran Nagar 6th Cross Street, Kamaraj Nagar, Avadi, Chennai - 600071",
  },
  phone: {
    e164: "919962506148",
    display: "99625 06148",
    tel: "+919962506148",
  },
  /** GST not applicable. Do not show a GSTIN anywhere. */
  gst: null as null,
  visitingChargeInr: 200,
  taglines: {
    hero: "Appliance service in Avadi, Chennai",
    heroSub: "Washing machine, fridge and dishwasher repair at your door",
    services: "Washing machine, refrigerator and dishwasher service",
    booking: "Book doorstep appliance service on WhatsApp",
  },
  serviceAreas: [
    "Ambattur",
    "Avadi",
    "Thirumullaivoyal",
    "Pattabiram",
    "Thiruninravur",
    "Thiruverkadu",
  ] as const,
  baseArea: "Avadi" as const,
  /** TODO_CONFIRM — owner to supply. Hide hours UI until set. */
  businessHours: null as null | string,
  visitSlots: [
    { id: "morning", label: "Morning" },
    { id: "afternoon", label: "Afternoon" },
    { id: "evening", label: "Evening" },
    { id: "anytime", label: "Anytime" },
  ] as const,
  /** Exact slot times TODO_CONFIRM */
  visitSlotTimes: null as null,
  services: [
    {
      id: "washing-machine",
      name: "Washing machine",
      types: ["Front load", "Top load", "Semi-automatic", "Other / not sure"],
      problems: [
        "Not draining",
        "Not spinning",
        "Leaking water",
        "Making noise",
        "Won't start",
        "Door won't open",
      ],
    },
    {
      id: "refrigerator",
      name: "Refrigerator",
      types: ["Single door", "Double door", "Side-by-side", "Other / not sure"],
      problems: [
        "Not cooling",
        "Ice build-up",
        "Leaking water",
        "Noisy compressor",
        "Light not working",
        "Door not sealing",
      ],
    },
    {
      id: "dishwasher",
      name: "Dishwasher",
      types: ["Built-in", "Freestanding", "Countertop", "Other / not sure"],
      problems: [
        "Not draining",
        "Dishes not clean",
        "Won't start",
        "Leaking",
        "Not drying",
        "Strange noise",
      ],
    },
  ] as const,
  commonBrands: [
    "LG",
    "Samsung",
    "Whirlpool",
    "IFB",
    "Bosch",
    "Haier",
    "Godrej",
    "Panasonic",
    "Siemens",
    "Voltas",
    "Other",
  ] as const,
  howItWorks: [
    "Book on WhatsApp.",
    "We confirm your slot.",
    "The technician visits and checks the appliance (visiting charge Rs 200).",
    "Labour charge is told to you.",
    "Repair is done at your door.",
  ] as const,
  /** TODO_CONFIRM order of steps with owner before launch */
  howItWorksConfirmed: false,
  /**
   * TODO_CONFIRM with owner before launch.
   * Remove from UI if not true.
   */
  labourPolicyLine:
    "We tell you the labour charge after checking the appliance.",
  labourPolicyConfirmed: false,
  faq: [
    {
      q: "Do you offer appliance service in Avadi and Chennai?",
      a: "Yes. Shariff Appliances Service provides doorstep appliance service from Avadi across Ambattur, Thirumullaivoyal, Pattabiram, Thiruninravur and Thiruverkadu.",
    },
    {
      q: "Which appliances do you repair?",
      a: "Washing machines, refrigerators and dishwashers. Front load, top load, single door, double door and built-in types.",
    },
    {
      q: "What is the visiting charge for appliance repair?",
      a: "Visiting charge is Rs 200. Labour is extra, based on the repair, and is told after checking the appliance.",
    },
    {
      q: "Which areas do you cover for doorstep service?",
      a: "Ambattur, Avadi, Thirumullaivoyal, Pattabiram, Thiruninravur and Thiruverkadu. Not on the list? Message us on WhatsApp and we will tell you if we can come.",
    },
    {
      q: "How do I book washing machine or fridge service?",
      a: "Fill the booking form on this site. It opens WhatsApp with your details ready to send, or call 99625 06148.",
    },
    {
      q: "How do I reach Shariff Appliances Service?",
      a: "Call or WhatsApp 99625 06148. We are based at Kumaran Nagar, Kamaraj Nagar, Avadi, Chennai.",
    },
  ] as const,
  /** Owner to supply 6–10 real photos. Keep empty until then. */
  gallery: [] as readonly string[],
  /**
   * Doorstep visit notes — service vignettes, not attributed customer reviews.
   * Replace with real named testimonials when the owner supplies them (TODO_CONFIRM).
   */
  doorstepNotes: [
    {
      id: "wm-avadi",
      serviceId: "washing-machine" as const,
      appliance: "Washing machine",
      area: "Avadi",
      care: "Spin",
      headline: "Stuck mid-cycle. Running before we left.",
      note: "Front load froze halfway through a spin. Drain path cleared, belt checked, and the rinse finished while the van was still outside.",
      outcome: "Laundry back on the same visit",
    },
    {
      id: "fridge-ambattur",
      serviceId: "refrigerator" as const,
      appliance: "Refrigerator",
      area: "Ambattur",
      care: "Cool",
      headline: "Warm on one side. Cold by evening tea.",
      note: "Double door cooling only half the cabinet. Capillary line cleared, seals wiped — cold air settled before dinner prep.",
      outcome: "Even cooling restored",
    },
    {
      id: "dw-pattabiram",
      serviceId: "dishwasher" as const,
      appliance: "Dishwasher",
      area: "Pattabiram",
      care: "Rinse",
      headline: "Grit on every plate. First clean load on site.",
      note: "Built-in leaving a film on crockery. Spray arms freed, filter reset — the proof cycle ran clean before we packed the kit.",
      outcome: "Clean wash verified on site",
    },
    {
      id: "wm-thiruverkadu",
      serviceId: "washing-machine" as const,
      appliance: "Washing machine",
      area: "Thiruverkadu",
      care: "Motor",
      headline: "Humming, not turning. Sorted same afternoon.",
      note: "Top load sounded busy but the drum sat still. Motor brushes sorted in one visit — the neighbour queued theirs for the next slot.",
      outcome: "Drum spinning again",
    },
    {
      id: "fridge-mullaivoyal",
      serviceId: "refrigerator" as const,
      appliance: "Refrigerator",
      area: "Thirumullaivoyal",
      care: "Frost",
      headline: "Ice wall gone. Floor stayed dry.",
      note: "A sheet of ice sat behind the freezer wall. Defrost path opened, drain cleared — no more puddles under the door.",
      outcome: "Frost cycle cleared",
    },
    {
      id: "wm-ninravur",
      serviceId: "washing-machine" as const,
      appliance: "Washing machine",
      area: "Thiruninravur",
      care: "Lock",
      headline: "Door locked after a short. Opened without a workshop trip.",
      note: "Door lock jammed after a power short. Lock assembly swapped at the doorstep — laundry started again without hauling the machine out.",
      outcome: "Door unlocked, wash resumed",
    },
  ] as const,
  privacyEmail: null as null | string,
} as const;

export type ServiceId = (typeof business.services)[number]["id"];
export type ServiceArea = (typeof business.serviceAreas)[number];
export type VisitSlotId = (typeof business.visitSlots)[number]["id"];
