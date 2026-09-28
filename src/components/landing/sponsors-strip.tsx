import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "./container";
import Heading from "./heading";
import { PlatformSponsorLogo } from "./platform-sponsor-logo";
import { platformSponsors } from "@/lib/sponsors";
import { getPaidSponsors } from "@/lib/stripe-sponsorship";

export default async function SponsorsStrip() {
  const paidSponsors = await getPaidSponsors();
  return (
    <section className="border-b border-border/70">
      <Container>
        <div className="md:border-x md:border-border/70">
          <div className="flex items-center justify-between gap-4 px-4 py-5 md:px-8">
            <Heading variant="small">Platform sponsors</Heading>
            <Link href="/sponsors" className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
              View sponsors <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-border/70 bg-border/70 lg:grid-cols-5">
            {platformSponsors.map((sponsor) => (
              <Link key={sponsor.name} href={sponsor.href} target="_blank" rel="noreferrer" aria-label={"Visit " + sponsor.name} className="flex min-h-24 items-center justify-center bg-background px-4 py-6 transition-colors hover:bg-muted/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground last:col-span-2 lg:last:col-span-1">
                <PlatformSponsorLogo sponsor={sponsor} />
              </Link>
            ))}
          </div>
          {paidSponsors.some((sponsor) => sponsor.tier !== "silver") && (
            <div className="border-t border-border/70 px-4 py-6 md:px-8">
              <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">Community sponsors</p>
              <div className="flex flex-wrap items-center gap-3">
                {paidSponsors.filter((sponsor) => sponsor.tier === "diamond" || sponsor.tier === "gold").map((sponsor) => (
                  <Link key={sponsor.name} href={sponsor.href} target="_blank" rel="noreferrer" className={"flex items-center gap-3 border border-border/70 bg-card px-4 transition-colors hover:bg-muted/50 " + (sponsor.tier === "diamond" ? "min-h-16" : "min-h-14")}>
                    {sponsor.logoSrc && <Image src={sponsor.logoSrc} alt="" width={40} height={40} unoptimized={sponsor.logoSrc.startsWith("https://")} className={sponsor.tier === "diamond" ? "size-10 object-contain" : "size-8 object-contain"} />}
                    <span className={"font-orbitron font-semibold " + (sponsor.tier === "diamond" ? "text-base" : "text-sm")}>{sponsor.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
