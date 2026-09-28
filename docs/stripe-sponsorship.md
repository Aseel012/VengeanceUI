# Stripe sponsorship setup

The Diamond, Gold, and Silver buttons use Stripe Checkout for monthly subscriptions. The site keeps the email contact option until the Stripe settings below are complete; it never sends a visitor to a payment flow that cannot record their sponsor details.

## 1. Create the recurring prices

In the Stripe Dashboard, create three active USD monthly recurring prices:

| Tier | Monthly price | Environment variable |
| --- | ---: | --- |
| Diamond | $250 | `STRIPE_SPONSOR_DIAMOND_PRICE_ID` |
| Gold | $150 | `STRIPE_SPONSOR_GOLD_PRICE_ID` |
| Silver | $100 | `STRIPE_SPONSOR_SILVER_PRICE_ID` |

The checkout route checks each Stripe price against the price shown on the site before creating a session. Use test-mode price IDs with a test secret key and live price IDs with a live key.

## 2. Configure the webhook and customer portal

Create a webhook destination for `https://www.vengenceui.com/api/sponsors/webhook` with these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

Copy its signing secret. The webhook verifies Stripe's signature and copies the name, website, and optional logo URL collected in Checkout to the new subscription's metadata.

Enable the Stripe-hosted customer portal login page and allow subscribers to cancel their subscription. Copy the shareable `https://billing.stripe.com/...` login URL.

## 3. Set server environment variables

Add these to `.env.local` for local development and to the deployment's server environment. Keep the secret key and webhook secret private.

```dotenv
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SPONSOR_DIAMOND_PRICE_ID=price_...
STRIPE_SPONSOR_GOLD_PRICE_ID=price_...
STRIPE_SPONSOR_SILVER_PRICE_ID=price_...
STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/login/...
```

Restart the local server after changing `.env.local`. For local webhook testing, run `stripe listen --forward-to localhost:3000/api/sponsors/webhook` and use the signing secret printed by Stripe CLI in `.env.local`.

Checkout returns to `https://www.vengenceui.com` in production and `http://localhost:3000` locally. For a staging domain, set `SPONSOR_CHECKOUT_ORIGIN=https://your-staging-domain.example`.

## 4. Approve a paid sponsor

After a successful test payment, confirm that the Stripe subscription has `sponsor_name`, `sponsor_website`, `sponsor_logo`, and `sponsor_tier` metadata. Review the requested placement and set `sponsor_approved` to `true` on that subscription in Stripe. Approved active subscriptions appear on the sponsors page within about two minutes; Diamond and Gold also appear on the homepage. A subscription that is no longer active stops appearing after the same cache interval.

The website URL must be a full `https://` URL. If the sponsor sends a logo file, add it under `public/sponsors/` and set `sponsor_logo` to its `/sponsors/...` path. External logo URLs must also use HTTPS. README placements still need a repository edit after approval.

## Test before live payments

Use Stripe test mode to complete each plan with a test card, verify the monthly amount and success page, inspect the webhook event and subscription metadata, approve a test subscription, then cancel it through the portal. Repeat the configuration with live keys, live prices, a live webhook secret, and a live portal URL before accepting real payments.
