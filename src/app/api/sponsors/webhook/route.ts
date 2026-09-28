import Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe-sponsorship";

export const runtime = "nodejs";

function fieldValue(session: Stripe.Checkout.Session, key: string) {
  return session.custom_fields?.find((field) => field.key === key)?.text?.value?.trim() ?? "";
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!stripe || !webhookSecret) return new Response("Stripe webhook is not configured", { status: 503 });
  if (!signature) return new Response("Missing Stripe signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch {
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode === "subscription" && session.metadata?.sponsor_origin === "vengeanceui" && session.payment_status === "paid") {
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      if (subscriptionId) {
        try {
          await stripe.subscriptions.update(subscriptionId, {
            metadata: {
              sponsor_name: fieldValue(session, "sponsor_name"),
              sponsor_website: fieldValue(session, "sponsor_website"),
              sponsor_logo: fieldValue(session, "sponsor_logo"),
            },
          });
        } catch (error) {
          console.error("Could not attach sponsorship details to Stripe subscription", error);
          return new Response("Webhook processing failed", { status: 500 });
        }
      }
    }
  }

  return Response.json({ received: true });
}
