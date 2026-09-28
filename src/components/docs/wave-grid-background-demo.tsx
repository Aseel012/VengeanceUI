"use client";

import { WaveGridBackground } from "@/components/ui/wave-grid-background";

export function WaveGridBackgroundDemo() {
  return (
    <div className="relative h-full min-h-[360px] w-full overflow-hidden rounded-xl">
      <WaveGridBackground colorBase="#ffffff" colorHigh="#0055ff">
        <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center px-5 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-950 sm:text-6xl">Wave Grid</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-700 sm:text-base">
            Move your cursor across the grid to send ripples through the cubes.
          </p>
        </div>
      </WaveGridBackground>
    </div>
  );
}
