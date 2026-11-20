/**
 * Feature flags. Reviews and WA automation stay off until prerequisites are met.
 */

export const FEATURES = {
  reviews: true,
  gallery: false,
  businessHours: false,
  waAutomation: process.env.FEATURE_WA_AUTOMATION === "true",
  tamilToggle: false,
} as const;
