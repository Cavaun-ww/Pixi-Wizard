# AR Creator: an AR website anyone can use

People sign up, upload a **photo** (the target) and a **video** (the overlay), and get:

- a **share link + QR code** for each AR experience (`ar.html?x=abc123`)
- their own **public profile page** listing everything they've made (`u.html?h=theirname`)
- **1 free AR experience**, then a **monthly subscription** for more
- uploads that **stay live on their profile forever**, even if they cancel

It's a static website (works on GitHub Pages, Netlify, Vercel or any host) plus two free-tier services:

| Piece | What it does | Cost to start |
|---|---|---|
| **Supabase** | accounts, database, file storage, server functions | free tier |
| **PayPal** | monthly subscription payments (PayPal balance or card) | per-transaction fee only |

The AR engine is the same one your current page uses (A-Frame 1.4.2 + MindAR 1.2.5). The `.mind` tracking file that you used to make by hand is now **compiled automatically in the user's browser** when they upload a photo.

---

## Files

```
index.html        landing page + pricing
auth.html         sign up / sign in
create.html       upload photo + video → publish (the screen from your screenshot)
dashboard.html    "My page": profile, plan, list of experiences, QR codes, delete
u.html            public profile  →  u.html?h=handle
ar.html           public AR viewer →  ar.html?x=slug
config.js         ← the only file you edit
app.js, styles.css  shared code and design
supabase/schema.sql               database, security rules, storage bucket
supabase/functions/paypal-activate   confirms a new subscription with PayPal, turns Pro on
supabase/functions/paypal-cancel     lets subscribers cancel from their account page
supabase/functions/paypal-webhook    keeps renewals, failed payments and cancellations in sync
```

---

## Setup (about 30 minutes)

### 1. Supabase project
1. Create a project at <https://supabase.com>.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, and click **Run**.
3. **Authentication → URL Configuration**: set **Site URL** to your website address (e.g. `https://yourname.github.io/ar/`) and add the same address under **Redirect URLs**.
4. **Project Settings → API**: copy the **Project URL** and the **anon public** key into `config.js`.

> If sign-ups should work instantly without an email confirmation, turn off **Authentication → Providers → Email → Confirm email**. Leaving it on is safer against spam accounts.

### 2. PayPal app + monthly plan
Start in **sandbox** (test mode). Do this again with live credentials when you launch.

1. Go to <https://developer.paypal.com> → **Apps & Credentials** → make sure **Sandbox** is selected → **Create App**. Copy the **Client ID** and **Secret**.
2. Create the subscription plan. In sandbox, go to <https://www.sandbox.paypal.com/billing/plans> (signed in as your sandbox *business* account). In live, it's **paypal.com → Pay & Get Paid → Subscriptions**.
   - Create a **Product** (e.g. "Pro"), then a **Plan**: fixed price, **every 1 month** (e.g. $9.99), no end date.
   - Copy the **Plan ID** (starts with `P-`).
3. In `config.js`, set `PAYPAL_CLIENT_ID`, `PAYPAL_PLAN_ID` and `PAYPAL_CURRENCY` (must match the plan). The Client ID is public, so it's safe in the website. **Never put the Secret in the website.**

### 3. Deploy the server functions
Install the Supabase CLI (<https://supabase.com/docs/guides/cli>) and then, from this folder:

```bash
supabase login
supabase link --project-ref YOUR-PROJECT-REF

supabase secrets set \
  PAYPAL_ENV=sandbox \
  PAYPAL_CLIENT_ID=your-client-id \
  PAYPAL_SECRET=your-secret \
  PAYPAL_PLAN_ID=P-...

supabase functions deploy paypal-activate
supabase functions deploy paypal-cancel
supabase functions deploy paypal-webhook --no-verify-jwt
```

### 4. PayPal webhook (renewals and cancellations)
1. In your PayPal app (developer.paypal.com → your app), scroll to **Webhooks → Add Webhook**.
2. URL: `https://YOUR-PROJECT-REF.supabase.co/functions/v1/paypal-webhook`
3. Events: `BILLING.SUBSCRIPTION.ACTIVATED`, `BILLING.SUBSCRIPTION.UPDATED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.SUSPENDED`, `BILLING.SUBSCRIPTION.EXPIRED`, `BILLING.SUBSCRIPTION.PAYMENT.FAILED`, `PAYMENT.SALE.COMPLETED`
4. Copy the **Webhook ID** and run:
   ```bash
   supabase secrets set PAYPAL_WEBHOOK_ID=...
   ```

### 5. Put the site online
Upload everything **except** the `supabase/` folder to your host. For GitHub Pages: push to a repo, then **Settings → Pages → Deploy from branch**. The site **must be on HTTPS**, because phones only allow camera access on secure sites.

### 6. Test it
Use PayPal **sandbox** first. developer.paypal.com → **Testing Tools → Sandbox Accounts** gives you a fake *personal* buyer account to pay with:
1. Sign up, then create one experience. It should be free.
2. Try to create a second. You should see the upgrade screen.
3. Click **Subscribe** and log in with the sandbox buyer account. The popup closes and your page shows **Pro**.
4. Open the share link on your phone and point it at the photo on your screen.
5. On your page, click **Cancel subscription**. You should still be Pro until the paid-through date.

**Going live:** create a live app and plan in PayPal, put the live Client ID and Plan ID in `config.js`, run `supabase secrets set PAYPAL_ENV=live PAYPAL_CLIENT_ID=... PAYPAL_SECRET=... PAYPAL_PLAN_ID=...`, and add the webhook to the live app (with its new Webhook ID).

---

## How the rules are enforced

All checks run **in the database**, so nobody can get around them by editing the website code:

- `profiles.free_used` flips to `true` automatically on someone's first experience. Users can't edit it.
- New experiences **and** new file uploads are only allowed if `free_used` is false **or** the user has an `active`/`trialing` subscription.
- Deleting an experience does **not** give the free slot back. "First upload free" means exactly once.
- Experiences are never hidden when a subscription ends; they just can't add new ones until they resubscribe.
- Only the server functions (using the server-only service key) can write to `subscriptions`, and they always re-check with PayPal. The browser is never trusted to say "I paid".
- Each PayPal subscription is tied to the account that started it, so nobody can claim someone else's subscription.
- If someone cancels, they keep Pro until the end of the month they paid for. If a payment fails, PayPal suspends the subscription and Pro turns off until it's fixed.

## Customizing

- **Name / price label / upload limits:** `config.js`. The real charge is set on the PayPal plan, so keep the label in sync.
- **Colors and fonts:** the `:root` block at the top of `styles.css`.
- **Max video size:** `MAX_VIDEO_MB` in `config.js` **and** `file_size_limit` in `schema.sql` (in bytes). The Supabase free plan caps single uploads at 50 MB.
- **Bandwidth:** every scan downloads the video. Supabase free includes 5 GB egress per month. For a popular site, move to the Pro plan or put storage behind a CDN.

## Notes for creators (worth showing on your site)

- Photos with lots of detail and contrast track best. Plain logos and large empty areas track poorly.
- MP4 (H.264) plays on every phone. iPhone HEVC `.mov` files may not play on Android.
- The video is cropped to cover the photo's shape exactly, so match the aspect ratio if framing matters.
