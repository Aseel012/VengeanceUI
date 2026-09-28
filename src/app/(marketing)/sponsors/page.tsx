import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, HeartHandshake, Mail, Plus } from "lucide-react";
import Container from "@/components/landing/container";
import Heading from "@/components/landing/heading";
import SubHeading from "@/components/landing/subheading";
import { Button } from "@/components/landing/ui/button";
import { CandyButton } from "@/components/ui/candy-button";
import { PlatformSponsorLogo } from "@/components/landing/platform-sponsor-logo";
import { platformSponsors, sponsorshipPlans } from "@/lib/sponsors";
import { getCustomerPortalUrl, getPaidSponsors, isSponsorCheckoutConfigured } from "@/lib/stripe-sponsorship";
import { SITE_NAME } from "@/lib/site";

const description =
  "Meet the platform sponsors behind Vengeance UI and choose a monthly sponsorship plan to display your name or logo.";

export const metadata: Metadata = {
  title: "Sponsors",
  description,
  alternates: { canonical: "/sponsors" },
  openGraph: {
    type: "website",
    url: "/sponsors",
    title: "Sponsors | " + SITE_NAME,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors | " + SITE_NAME,
    description,
  },
};

function sponsorInquiry(plan: string) {
  const subject = encodeURIComponent("Vengeance UI " + plan + " sponsorship");
  const body = encodeURIComponent(
    "Hi Ashutosh,\n\nI'm interested in the " + plan + " sponsorship plan.\n\nName or company to display:\nWebsite URL:\nLogo URL or attachment (optional):\nPreferred contact email:\n\nThanks!"
  );
  return "mailto:ashutoshx002@gmail.com?subject=" + subject + "&body=" + body;
}

const tierOrder = { diamond: 0, gold: 1, silver: 2 };
export default async function SponsorsPage({ searchParams }: { searchParams: Promise<{ checkout?: string | string[] }> }) {
  const [sponsors, query] = await Promise.all([getPaidSponsors(), searchParams]);
  const listedSponsors = sponsors.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
  const checkoutReady = isSponsorCheckoutConfigured();
  const portalUrl = getCustomerPortalUrl();
  const checkoutIssue = query.checkout === "unavailable" || query.checkout === "invalid-plan";

  return (
    <>
      <section className="border-b border-border/70">
        <Container>
          <div className="flex flex-col items-center border-border/70 px-4 py-16 text-center md:border-x md:px-8 md:py-24 lg:py-28">
            <div className="mb-7 inline-flex items-center gap-2 rounded-md border border-foreground/10 bg-foreground/[0.035] px-3 py-1.5 font-mono text-xs text-muted-foreground dark:bg-white/[0.035]">
              <HeartHandshake className="size-3.5 text-foreground" aria-hidden="true" />
              Support the project
            </div>
            <Heading as="h1" variant="big" className="max-w-4xl text-balance leading-tight">
              Support the future of Vengeance UI.
            </Heading>
            <p className="mt-6 max-w-2xl text-balance text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              Help keep the open-source library growing. Sponsors are recognized across the project with a name or logo and a link to their work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="default" size="lg" className="h-11 text-base">
                <Link href="#plans">See sponsorship plans <ArrowDown className="size-4" aria-hidden="true" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 text-base">
                <Link href={sponsorInquiry("custom")} >Discuss a partnership <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border/70">
        <Container>
          <div className="border-border/70 md:border-x">
            <div className="grid gap-4 px-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end md:px-8 md:py-14">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">The tools behind the project</p>
                <Heading as="h2" variant="medium">Platform sponsors</Heading>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted-foreground md:justify-self-end md:text-base">
                These partners provide platform support. Monthly community sponsorships are listed separately below.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px border-y border-border/70 bg-border/70 lg:grid-cols-5">
              {platformSponsors.map((sponsor) => (
                <Link
                  key={sponsor.name}
                  href={sponsor.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={"Visit " + sponsor.name}
                  className="group flex min-h-28 items-center justify-center bg-background px-4 py-7 transition-colors hover:bg-muted/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground last:col-span-2 lg:min-h-32 lg:last:col-span-1"
                >
                  <PlatformSponsorLogo sponsor={sponsor} />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="paid-sponsors" className="scroll-mt-24 border-b border-border/70">
        <Container>
          <div className="grid gap-8 border-border/70 px-4 py-12 md:border-x md:px-8 md:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Paid sponsorship</p>
              <Heading as="h2" variant="medium" className="mt-4 max-w-lg">Add your name to Vengeance UI.</Heading>
              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
                Back the project with a monthly plan. Once confirmed, your name or logo and a link to your site will appear here, separate from platform sponsors.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button asChild variant="default" size="lg" className="h-11">
                  <Link href="#plans">Explore paid plans <ArrowRight className="size-4" aria-hidden="true" /></Link>
                </Button>
                <span className="text-sm text-muted-foreground">From $100 / month</span>
              </div>
            </div>
            {listedSponsors.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {listedSponsors.map((sponsor) => (
                  <Link key={sponsor.name} href={sponsor.href} target="_blank" rel="noreferrer" className={"group flex min-h-28 items-center gap-4 border border-border/70 bg-card p-5 transition-colors hover:bg-muted/40 " + (sponsor.tier === "diamond" ? "sm:col-span-2" : "")}>
                    {sponsor.logoSrc && <Image src={sponsor.logoSrc} alt="" width={48} height={48} unoptimized={sponsor.logoSrc.startsWith("https://")} className={sponsor.tier === "diamond" ? "size-14 object-contain" : "size-12 object-contain"} />}
                    <div>
                      <p className={"font-orbitron font-semibold " + (sponsor.tier === "diamond" ? "text-lg" : "text-base")}>{sponsor.name}</p>
                      <p className="mt-1 font-mono text-[11px] uppercase text-muted-foreground">{sponsor.tier} sponsor</p>
                    </div>
                    <ArrowUpRight className="ml-auto size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center border border-dashed border-border bg-muted/25 px-6 py-8 text-center dark:border-white/15 dark:bg-white/[0.025]">
                <div className="flex size-11 items-center justify-center rounded-full border border-border bg-background dark:border-white/15"><Plus className="size-4" aria-hidden="true" /></div>
                <p className="mt-5 font-orbitron text-base font-semibold">Your name or logo here</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">This space is reserved for confirmed paid sponsors.</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section id="plans" className="scroll-mt-24 border-b border-border/70 dark:bg-[#050608]">
        <Container>
          <div className="grid border-border/70 md:border-x dark:md:border-white/10 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="border-b border-border/70 bg-muted/25 px-4 py-12 dark:border-white/10 dark:bg-[#0b0b0c] md:px-8 md:py-16 lg:border-b-0 lg:border-r">
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-foreground/60 dark:text-zinc-300">Monthly plans</p>
                <Heading as="h2" variant="medium" className="mt-4">Choose a tier.</Heading>
                <p className="mt-4 max-w-sm text-[15px] leading-7 text-foreground/70 dark:text-zinc-300">
                  Each tier includes a linked name or logo on the sponsors page. Higher tiers add placement across the home page and README.
                </p>
                <div className="mt-8 border-t border-border/70 pt-5 text-xs leading-6 text-foreground/60 dark:border-white/10 dark:text-zinc-400">
                  <p>All prices in USD per month.</p>
                  <p>{checkoutReady ? "Secure monthly billing through Stripe. Display details are reviewed before publishing." : "Online checkout is being set up. Contact us to arrange a sponsorship."}</p>
                  {portalUrl && <Link href={portalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-foreground underline underline-offset-4">Manage subscription <ArrowUpRight className="size-3" aria-hidden="true" /></Link>}
                </div>
              </div>
            </div>
            <div>
              {checkoutIssue && <div role="alert" className="border-b border-border/70 bg-muted/40 px-4 py-4 text-sm text-foreground md:px-8">Checkout could not start. Please try again or contact us for help.</div>}
              {sponsorshipPlans.map((plan, index) => (
                <article key={plan.tier} className={"relative isolate overflow-hidden border-b border-border/70 px-4 py-8 transition-colors duration-300 dark:border-white/10 md:px-8 md:py-10 " + (plan.featured ? "bg-background ring-1 ring-inset ring-foreground/35 dark:bg-black dark:ring-white/45" : "bg-background/50 hover:bg-muted/40 dark:bg-[#09090b] dark:hover:bg-[#111113]")}>
                  {plan.featured && (
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(0,0,0,0.025),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,255,255,0.055),transparent_60%)]" aria-hidden="true" />
                  )}
                  <div className="relative z-10 grid gap-7 xl:grid-cols-[200px_minmax(0,1fr)] xl:gap-10">
                    <div>
                      <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/60 dark:text-zinc-300">
                        <span>{String(index + 1).padStart(2, "0")} / 03</span>
                        {plan.featured && <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/5 px-2 py-0.5 text-foreground dark:border-white/20 dark:bg-white/[0.06] dark:text-white"><span className="size-1 rounded-full bg-current shadow-[0_0_8px_rgba(255,255,255,0.55)]" aria-hidden="true" />Featured</span>}
                      </div>
                      <h3 className="mt-4 font-orbitron text-xl font-semibold text-foreground">{plan.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-semibold tracking-tight text-foreground">${plan.price}</span>
                        <span className="text-sm text-foreground/65 dark:text-zinc-300">/ month</span>
                      </div>
                      <p className="mt-3 max-w-xs text-sm leading-6 text-foreground/70 dark:text-zinc-300">{plan.description}</p>
                    </div>
                    <div className="flex flex-col justify-between">
                      <ul className="grid gap-x-7 gap-y-3 sm:grid-cols-2">
                        {plan.benefits.map((benefit) => (
                          <li key={benefit} className="flex gap-2.5 text-[15px] leading-6 text-foreground/85 dark:text-zinc-200">
                            <Check className="mt-1 size-4 shrink-0 text-foreground/70 dark:text-white/80" aria-hidden="true" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-7 flex justify-end border-t border-border/70 pt-5 dark:border-white/10">
                        {checkoutReady ? (
                          <form action="/api/sponsors/checkout" method="post" className="w-full sm:w-fit">
                            <input type="hidden" name="tier" value={plan.tier} />
                            <Button type="submit" variant={plan.featured ? "default" : "outline"} size="sm" className={"h-10 w-full sm:w-fit " + (plan.featured ? "dark:shadow-[0_0_18px_rgba(255,255,255,0.12)]" : "dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.09]")}>
                              Choose {plan.name} <ArrowRight className="size-4" aria-hidden="true" />
                            </Button>
                          </form>
                        ) : (
                          <Button asChild variant={plan.featured ? "default" : "outline"} size="sm" className={"h-10 w-full sm:w-fit " + (plan.featured ? "dark:shadow-[0_0_18px_rgba(255,255,255,0.12)]" : "dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.09]")}>
                            <Link href={sponsorInquiry(plan.name)}>Contact about {plan.name} <ArrowRight className="size-4" aria-hidden="true" /></Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="grid gap-8 border-border/70 px-4 py-12 md:border-x md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <Heading as="h2" variant="medium">Have a different idea?</Heading>
              <SubHeading>For platform support, a custom package, or a question about placement, email me or send me a DM on X.</SubHeading>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="outline" size="lg" className="h-11">
                  <Link href={sponsorInquiry("custom")}><Mail className="size-4" aria-hidden="true" /> Email me <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
                </Button>
                <CandyButton asChild tone="neutral" className="h-11 rounded-md px-5 text-sm">
                  <Link href="https://x.com/Ashutosh_7x7" target="_blank" rel="noreferrer">DM me on X <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
                </CandyButton>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="border border-border/70 bg-card p-5">
                <p className="font-orbitron text-sm font-semibold">Can an individual sponsor?</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Yes. We can display your name instead of a company logo, with a link you choose.</p>
              </div>
              <div className="border border-border/70 bg-card p-5">
                <p className="font-orbitron text-sm font-semibold">Are platform sponsors on a paid tier?</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">No. Platform support is listed separately from Diamond, Gold, and Silver sponsorship.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
