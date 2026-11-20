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
    hero: "Expert Care for Every Home Appliance.",
    heroSub: "Fast Fixes. Genuine Parts. Lasting Comfort.",
    services: "Your Home Appliances, Running Like New.",
    booking: "Trusted Doorstep Repairs You Can Count On.",
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
      q: "Which areas do you cover?",
      a: "Ambattur, Avadi, Thirumullaivoyal, Pattabiram, Thiruninravur and Thiruverkadu. Not on the list? Message us on WhatsApp and we will tell you if we can come.",
    },
    {
      q: "What is the visiting charge?",
      a: "Rs 200. Labour is extra, based on the repair.",
    },
    {
      q: "Which appliances do you repair?",
      a: "Washing machines, refrigerators and dishwashers. All types of service.",
    },
    {
      q: "How do I book?",
      a: "Fill the booking form on this site. It opens WhatsApp with your details ready to send.",
    },
    {
      q: "How do I reach you?",
      a: "Call or WhatsApp 99625 06148.",
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
      appliance: "Washing machine",
      area: "Avadi",
      care: "30°",
      note: "Front load stuck mid-spin. Drain path cleared, belt checked — rinse finished before we packed up.",
    },
    {
      id: "fridge-ambattur",
      appliance: "Refrigerator",
      area: "Ambattur",
      care: "Cool",
      note: "Double door warm on one side. Capillary line cleared, seals wiped — cold air back by evening tea.",
    },
    {
      id: "dw-pattabiram",
      appliance: "Dishwasher",
      area: "Pattabiram",
      care: "Rinse",
      note: "Built-in leaving grit on plates. Spray arms freed, filter reset — first clean load ran while we were there.",
    },
    {
      id: "wm-thiruverkadu",
      appliance: "Washing machine",
      area: "Thiruverkadu",
      care: "Spin",
      note: "Top load humming but no turn. Motor brushes sorted same visit — neighbour asked for their machine next.",
    },
    {
      id: "fridge-mullaivoyal",
      appliance: "Refrigerator",
      area: "Thirumullaivoyal",
      care: "Frost",
      note: "Ice sheet behind the freezer wall. Defrost path opened, drain cleared — no more puddles under the door.",
    },
    {
      id: "wm-ninravur",
      appliance: "Washing machine",
      area: "Thiruninravur",
      care: "Soft",
      note: "Door lock jammed after a short. Lock assembly swapped — laundry started again without a workshop trip.",
    },
  ] as const,
  privacyEmail: null as null | string,
} as const;

export type ServiceId = (typeof business.services)[number]["id"];
export type ServiceArea = (typeof business.serviceAreas)[number];
export type VisitSlotId = (typeof business.visitSlots)[number]["id"];
