import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import Container from "@/components/landing/container";
import Heading from "@/components/landing/heading";
import { Button } from "@/components/landing/ui/button";
import { getCustomerPortalUrl, getSponsorshipPlan, getStripeClient } from "@/lib/stripe-sponsorship";

export const metadata: Metadata = {
  title: "Sponsorship confirmation",
  robots: { index: false, follow: false },
};

export default async function SponsorThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string | string[] }> }) {
  const { session_id: sessionId } = await searchParams;
  const stripe = getStripeClient();
  const portalUrl = getCustomerPortalUrl();
  let planName: string | null = null;

  if (stripe && typeof sessionId === "string" && /^cs_[a-zA-Z0-9_]+$/.test(sessionId) && sessionId.length < 200) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.mode === "subscription" && session.status === "complete" && session.payment_status === "paid" && session.metadata?.sponsor_origin === "vengeanceui") {
        planName = getSponsorshipPlan(session.metadata.sponsor_tier)?.name ?? null;
      }
    } catch (error) {
      console.error("Could not verify sponsor checkout session", error);
    }
  }

  return (
    <section className="border-b border-border/70">
      <Container>
        <div className="flex min-h-[560px] flex-col items-start justify-center border-border/70 px-4 py-16 md:border-x md:px-8">
          {planName ? (
            <>
              <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/5"><Check className="size-5" aria-hidden="true" /></div>
              <Heading as="h1" variant="big" className="max-w-3xl">Thank you for backing Vengeance UI.</Heading>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Your {planName} payment is confirmed. We’ll review the name, website, and optional logo you entered at checkout before publishing your placement.</p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Need to send a logo file or change your display details? Email <a className="text-foreground underline underline-offset-4" href="mailto:ashutoshx002@gmail.com">ashutoshx002@gmail.com</a>.</p>
            </>
          ) : (
            <>
              <Heading as="h1" variant="big" className="max-w-3xl">Checkout status unavailable.</Heading>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">We couldn’t verify a completed payment from this link. Check your Stripe receipt or contact us if you need help.</p>
            </>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link href="/sponsors"><ArrowLeft className="size-4" aria-hidden="true" /> Back to sponsors</Link></Button>
            {portalUrl && <Button asChild variant="outline" size="lg"><Link href={portalUrl} target="_blank" rel="noreferrer">Manage subscription <ArrowUpRight className="size-4" aria-hidden="true" /></Link></Button>}
          </div>
        </div>
      </Container>
    </section>
  );
}
