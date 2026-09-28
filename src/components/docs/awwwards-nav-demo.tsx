"use client";

import { AwwwardsNav } from "@/components/ui/awwwards-nav";

/**
 * Preview for the Awwwards Nav. The nav defaults to `fixed` positioning, so
 * here it's overridden to `absolute` inside the (transparent) preview stage so
 * it sits directly on the preview surface. The glass adapts to light and dark
 * mode — click "More" to expand the mega-menu.
 */
export function AwwwardsNavDemo() {
  return (
    <div className="relative flex h-full w-full items-end justify-center overflow-hidden">
      <AwwwardsNav className="absolute bottom-6 left-1/2 -translate-x-1/2" />
    </div>
  );
}

export default AwwwardsNavDemo;
