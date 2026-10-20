// ─────────────────────────────────────────────────────────────
//  SITE CONFIG — the only file you need to edit to go live.
//  See README.md for where each value comes from.
// ─────────────────────────────────────────────────────────────
window.APP_CONFIG = {
  // Name shown in the header, page titles and emails
  SITE_NAME: "AR Creator",

  // Supabase → Project Settings → API
  SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
  SUPABASE_ANON_KEY: "YOUR-SUPABASE-ANON-KEY",

  // PayPal → developer.paypal.com → Apps & Credentials (Client ID is public, safe here)
  PAYPAL_CLIENT_ID: "YOUR-PAYPAL-CLIENT-ID",
  // The monthly plan you create in PayPal (starts with P-)
  PAYPAL_PLAN_ID: "P-YOUR-PLAN-ID",
  // Must match the plan's currency
  PAYPAL_CURRENCY: "USD",

  // Shown on the pricing section + paywall (the real charge is set on the PayPal plan)
  PRO_PRICE_LABEL: "$9.99",
  PRO_PRICE_PERIOD: "month",

  // Upload limits (also enforced by the storage bucket settings in schema.sql)
  MAX_VIDEO_MB: 50,
  MAX_IMAGE_MB: 10,
};
