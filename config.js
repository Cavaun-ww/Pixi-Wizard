// ─────────────────────────────────────────────────────────────
//  SITE CONFIG — the only file you need to edit to go live.
//  See README.md for where each value comes from.
// ─────────────────────────────────────────────────────────────
window.APP_CONFIG = {
  // Name shown in the header, page titles and emails
  SITE_NAME: "Pixi Wizard",

  // Supabase → Project Settings → API
  SUPABASE_URL: "https://eoeoegmdgdwyxaksqbzc.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZW9lZ21kZ2R3eXhha3NxYnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MDc3NjUsImV4cCI6MjEwODA4Mzc2NX0.Wv-vtm0m8hp7cjMMWKOEpz2GnVsyFq8WdM-hz5SX858",

  // Shown on the Privacy and Terms pages for support / account deletion
  SUPPORT_EMAIL: "cavauntechnologies@gmail.com",

  // Show the "Continue with Google" button (needs Google turned on in
  // Supabase → Authentication → Sign In / Providers → Google)
  GOOGLE_SIGN_IN: true,

  // PayPal → developer.paypal.com → Apps & Credentials (Client ID is public, safe here)
  PAYPAL_CLIENT_ID: "BAA4Voryl_nA8U5_ZAXo0BUe7JyLLdC10-gNiayC_7LtIY3fZ8HB5TOUjqFKjgMMkBc3JZn9EHSJI0PuzE",
  // The monthly plan you create in PayPal (starts with P-)
  PAYPAL_PLAN_ID: "P-4WT42081HL971790ENLL4B4Q",
  // Must match the plan's currency
  PAYPAL_CURRENCY: "USD",

  // Shown on the pricing section + paywall (the real charge is set on the PayPal plan)
  PRO_PRICE_LABEL: "$9.99",
  PRO_PRICE_PERIOD: "month",

  // How many of the newest photos the Explore AR camera can recognize at once
  // (more = slower to start on older phones)
  EXPLORE_LIMIT: 40,

  // Upload limits (also enforced by the storage bucket settings in schema.sql)
  MAX_VIDEO_MB: 10, // keeps storage and viewing bandwidth costs down
  MAX_IMAGE_MB: 10,
};
