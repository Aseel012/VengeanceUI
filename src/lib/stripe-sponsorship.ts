import { unstable_cache } from "next/cache";
import Stripe from "stripe";
import { paidSponsors, sponsorshipPlans, type PaidSponsor, type SponsorTier } from "@/lib/sponsors";

const priceEnvByTier: Record<SponsorTier, string | undefined> = {
  diamond: process.env.STRIPE_SPONSOR_DIAMOND_PRICE_ID,
  gold: process.env.STRIPE_SPONSOR_GOLD_PRICE_ID,
  silver: process.env.STRIPE_SPONSOR_SILVER_PRICE_ID,
};

export function getSponsorshipPlan(tier: string) {
  return sponsorshipPlans.find((plan) => plan.tier === tier);
}

export function getSponsorshipPriceId(tier: SponsorTier) {
  return priceEnvByTier[tier];
}

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return secretKey ? new Stripe(secretKey, { maxNetworkRetries: 2 }) : null;
}

export function getCustomerPortalUrl() {
  const value = process.env.STRIPE_CUSTOMER_PORTAL_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "billing.stripe.com" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function isSponsorCheckoutConfigured() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return Boolean(
    (secretKey?.startsWith("sk_test_") || secretKey?.startsWith("sk_live_")) &&
    process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_") &&
    Object.values(priceEnvByTier).every((id) => id?.startsWith("price_")) &&
    getCustomerPortalUrl()
  );
}

function publicWebsite(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function publicLogo(value: string | undefined) {
  if (!value) return undefined;
  if (/^\/sponsors\/[a-zA-Z0-9/_-]+\.(svg|png|webp)$/.test(value)) return value;
  return publicWebsite(value) ?? undefined;
}

const getApprovedStripeSponsors = unstable_cache(
  async (): Promise<PaidSponsor[]> => {
    const stripe = getStripeClient();
    if (!stripe) return [];

    try {
      const subscriptions = await stripe.subscriptions
        .list({ status: "active", limit: 100 })
        .autoPagingToArray({ limit: 1000 });

      return subscriptions.flatMap((subscription) => {
        const meta = subscription.metadata;
        if (meta.sponsor_origin !== "vengeanceui" || meta.sponsor_approved !== "true") return [];
        if (meta.sponsor_tier !== "diamond" && meta.sponsor_tier !== "gold" && meta.sponsor_tier !== "silver") return [];

        const name = meta.sponsor_name?.trim().slice(0, 80);
        const href = publicWebsite(meta.sponsor_website);
        if (!name || !href) return [];

        return [{ name, href, tier: meta.sponsor_tier, logoSrc: publicLogo(meta.sponsor_logo) }];
      });
    } catch (error) {
      console.error("Could not load approved Stripe sponsors", error);
      return [];
    }
  },
  ["approved-stripe-sponsors-v1"],
  { revalidate: 120 }
);

export async function getPaidSponsors() {
  const stripeSponsors = await getApprovedStripeSponsors();
  const unique = new Map<string, PaidSponsor>();
  for (const sponsor of [...paidSponsors, ...stripeSponsors]) {
    unique.set(`${sponsor.name.toLowerCase()}|${sponsor.href}`, sponsor);
  }
  return [...unique.values()];
}
