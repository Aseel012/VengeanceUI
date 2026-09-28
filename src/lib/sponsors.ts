import { VERCEL_OSS_PROGRAM_URL } from "@/lib/site";

export const platformSponsors = [
  { id: "mintlify", name: "Mintlify", href: "https://www.mintlify.com/" },
  { id: "sentry", name: "Sentry", href: "https://sentry.io/" },
  { id: "browserstack", name: "BrowserStack", href: "https://www.browserstack.com/" },
  { id: "sarvam", name: "Sarvam AI", href: "https://www.sarvam.ai/" },
  { id: "vercel", name: "Vercel OSS Program", href: VERCEL_OSS_PROGRAM_URL },
] as const;

export type PlatformSponsor = (typeof platformSponsors)[number];

export type SponsorTier = "diamond" | "gold" | "silver";

export type PaidSponsor = {
  name: string;
  href: string;
  tier: SponsorTier;
  /** Optional local image path, for example /sponsors/acme.svg. */
  logoSrc?: string;
};

// Add sponsors here once their placement and display details are confirmed.
// Both the homepage and sponsor page read from this list.
export const paidSponsors: PaidSponsor[] = [];

export const sponsorshipPlans = [
  {
    name: "Diamond",
    tier: "diamond",
    price: 250,
    featured: true,
    description: "Maximum visibility and a direct line to the maintainer.",
    benefits: [
      "Your name or logo in the top spot on the sponsors page",
      "Largest placement on the home page",
      "Largest placement in the README",
      "A shoutout on X when you join",
      "Direct line for feedback and requests",
    ],
  },
  {
    name: "Gold",
    tier: "gold",
    price: 150,
    featured: false,
    description: "Stand out across the site and README.",
    benefits: [
      "Your name or logo on the sponsors page",
      "Featured placement on the home page",
      "Featured placement in the README",
      "A shoutout on X when you join",
    ],
  },
  {
    name: "Silver",
    tier: "silver",
    price: 100,
    featured: false,
    description: "A simple way to back the library.",
    benefits: [
      "Your name or logo on the sponsors page",
      "A link to your website",
      "Your name or logo in the README",
    ],
  },
] as const;
