import { NextResponse } from "next/server";
import { getSponsorshipPlan, getSponsorshipPriceId, getStripeClient, isSponsorCheckoutConfigured } from "@/lib/stripe-sponsorship";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

function checkoutOrigin(request: Request) {
  const configured = process.env.SPONSOR_CHECKOUT_ORIGIN;
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === "https:" || (url.protocol === "http:" && url.hostname === "localhost")) return url.origin;
    } catch {
      // Fall through to the known site URL.
    }
  }

  const host = request.headers.get("host");
  if (host && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return `http://${host}`;
  return SITE_URL;
}

function backToPlans(request: Request, reason: string) {
  return NextResponse.redirect(new URL(`/sponsors?checkout=${reason}#plans`, checkoutOrigin(request)), 303);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const tier = form.get("tier");
  const plan = typeof tier === "string" ? getSponsorshipPlan(tier) : undefined;
  if (!plan) return backToPlans(request, "invalid-plan");
  if (!isSponsorCheckoutConfigured()) return backToPlans(request, "unavailable");

  const stripe = getStripeClient();
  const priceId = getSponsorshipPriceId(plan.tier);
  if (!stripe || !priceId) return backToPlans(request, "unavailable");

  try {
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active || price.currency !== "usd" || price.unit_amount !== plan.price * 100 || price.recurring?.interval !== "month") {
      console.error(`Stripe price for ${plan.tier} does not match the published monthly price`);
      return backToPlans(request, "unavailable");
    }

    const origin = checkoutOrigin(request);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_types: ["card"],
      success_url: `${origin}/sponsors/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/sponsors#plans`,
      client_reference_id: `vengeanceui_${plan.tier}`,
      metadata: { sponsor_origin: "vengeanceui", sponsor_tier: plan.tier },
      subscription_data: { metadata: { sponsor_origin: "vengeanceui", sponsor_tier: plan.tier } },
      custom_fields: [
        { key: "sponsor_name", label: { type: "custom", custom: "Name to display" }, type: "text", text: { maximum_length: 80 } },
        { key: "sponsor_website", label: { type: "custom", custom: "Website URL (https://...)" }, type: "text", text: { maximum_length: 200 } },
        { key: "sponsor_logo", label: { type: "custom", custom: "Logo URL (optional)" }, type: "text", text: { maximum_length: 200 }, optional: true },
      ],
      custom_text: { submit: { message: "Your display details are reviewed before appearing on Vengeance UI." } },
    });

    if (!session.url) return backToPlans(request, "unavailable");
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Could not start Stripe sponsorship checkout", error);
    return backToPlans(request, "unavailable");
  }
}
