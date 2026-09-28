import Image from "next/image";
import type { PlatformSponsor } from "@/lib/sponsors";

export function PlatformSponsorLogo({ sponsor }: { sponsor: PlatformSponsor }) {
  switch (sponsor.id) {
    case "mintlify":
      return (
        <>
          <Image src="/sponsors/mintlify-light.svg" alt="" width={1682} height={368} className="h-7 w-auto max-w-[150px] dark:hidden sm:h-8 sm:max-w-[165px]" />
          <Image src="/sponsors/mintlify-dark.svg" alt="" width={1682} height={368} className="hidden h-7 w-auto max-w-[150px] dark:block sm:h-8 sm:max-w-[165px]" />
        </>
      );
    case "sentry":
      return <Image src="/sponsors/sentry.svg" alt="" width={512} height={113} className="h-7 w-auto max-w-[145px] brightness-0 dark:invert sm:h-8 sm:max-w-[165px]" />;
    case "browserstack":
      return (
        <span className="flex items-center gap-2">
          <Image src="/sponsors/browserstack-mark.svg" alt="" width={32} height={32} className="size-7 shrink-0 lg:size-8" />
          <span className="font-sans text-base font-semibold tracking-tight lg:text-lg">BrowserStack</span>
        </span>
      );
    case "sarvam":
      return (
        <>
          <Image src="/sponsors/sarvam-light.svg" alt="" width={202} height={32} className="h-6 w-auto max-w-[155px] dark:hidden lg:h-7 lg:max-w-[175px]" />
          <Image src="/sponsors/sarvam-dark.svg" alt="" width={202} height={32} className="hidden h-6 w-auto max-w-[155px] dark:block lg:h-7 lg:max-w-[175px]" />
        </>
      );
    case "vercel":
      return (
        <span className="flex flex-col items-center gap-2.5">
          <Image src="/sponsors/vercel-light.svg" alt="" width={2048} height={407} className="h-auto w-[165px] max-w-full dark:hidden" />
          <Image src="/sponsors/vercel-dark.svg" alt="" width={2048} height={407} className="hidden h-auto w-[165px] max-w-full dark:block" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">OSS Program</span>
        </span>
      );
  }
}
