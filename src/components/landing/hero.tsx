import Link from "next/link";
import Container from "./container";
import Heading from "./heading";
import SubHeading from "./subheading";
import { Button } from "./ui/button";
import { BorderBeam } from "./ui/border-beam";
import IsometricGrid from "./ui/isometric-grid";
import IsometricHeroBox from "./ui/isometric-hero-box";
import { GITHUB_REPO_URL } from "@/lib/github";
import { VERCEL_OSS_PROGRAM_URL } from "@/lib/site";

export default function Hero() {
    return <section id="hero" className="relative isolate">
        <Container>
            <div className="flex flex-col overflow-hidden border-b md:min-h-[720px] md:flex-row md:divide-x md:border-x">
                {/* Left Column */}
                <div className="flex flex-1 flex-col justify-center">
                    <div className="flex max-w-[38rem] flex-col gap-6 px-4 py-16 md:px-8 md:py-20 lg:px-10">
                        <div className="w-fit relative rounded-md">
                            <VercelOSSProgramBadge />
                            <BorderBeam
                                size={40}
                                duration={3}
                                delay={0}
                                borderWidth={1.5}
                                colorFrom="rgba(255, 255, 255, 0.8)"
                                colorTo="transparent"
                                className="block dark:opacity-50 opacity-20"
                            />
                        </div>

                        <Heading variant="big" as="h1" className="text-start">
                            Next-Gen UI
                            <span className="dark:bg-linear-to-r dark:from-zinc-500 dark:via-zinc-300 dark:to-zinc-500 bg-linear-to-r from-zinc-700 via-zinc-900 to-zinc-700 bg-clip-text text-transparent"> Interactions</span>
                        </Heading>
                        <SubHeading variant="big" as="h2">
                            Hover effects, animated tooltips, and scroll-driven layouts
                            designed for modern marketing websites.
                        </SubHeading>

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <Button
                                asChild
                                variant={"default"}
                                size="lg"
                                className="rounded-md w-fit font-medium text-base">
                                <Link href="/components">
                                    Explore blocks
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant={"outline"}
                                size="lg"
                                className="rounded-md w-fit font-medium text-base shadow">
                                <Link href={GITHUB_REPO_URL}>
                                    View GitHub
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="relative flex min-h-[620px] flex-1 flex-col items-center justify-center overflow-hidden bg-muted px-4 py-10 dark:bg-[#0b0b0c] md:min-h-0 md:py-12 lg:px-6 xl:px-8" style={{ contain: 'content', transform: 'translateZ(0)' }}>
                    <div className="absolute inset-0 border m-4 border-neutral-400 dark:border-white/10" />
                    <div className="pointer-events-none absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_50%_72%,rgba(255,255,255,0.06),transparent_30%)]" />
                    <div className="relative flex h-full w-full flex-col items-center justify-center">
                        <IsometricHeroBox
                            bgClassName="text-neutral-400 dark:text-[#0a0a0b]"
                            stageClassName="text-zinc-200 dark:text-[#0a0a0b]"
                            strokeClassName="text-background stroke-foreground dark:text-[#0a0a0b] dark:stroke-zinc-200"
                            strokeClassName2="text-background stroke-foreground dark:text-[#060607] dark:stroke-zinc-200"
                            logoShadow="text-zinc-700 dark:text-zinc-600"
                            primaryClassName="text-zinc-800 dark:text-zinc-300"
                            size={400}
                            className="w-full max-w-[360px] lg:max-w-[400px]"
                        />

                        <IsometricGrid className="z-0 scale-[2.65] mask-radial-from-0% opacity-50 dark:opacity-40" />
                    </div>
                </div>
            </div>
        </Container>
    </section>
}

export const VercelOSSProgramBadge = () => {
    return (
        <a href={VERCEL_OSS_PROGRAM_URL} className="flex h-8 items-center gap-2 rounded-md bg-muted dark:bg-muted/60 border px-4 text-sm font-medium"><span className="text-muted-foreground">Backed by</span><span>▲ Vercel OSS Program</span></a>
    )
}
