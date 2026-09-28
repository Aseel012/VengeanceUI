"use client";

import StatsCounter from "@/components/ui/stats-counter";

const stats = [
  { value: 250, suffix: "+", label: "Components" },
  { value: 12000, suffix: "+", label: "Downloads" },
  { value: 99, suffix: "%", label: "Satisfaction" },
];

export function StatsCounterDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-3 divide-x divide-neutral-200 border-y border-neutral-200 py-7 dark:divide-white/15 dark:border-white/15">
      {stats.map((stat) => (
        <div key={stat.label} className="flex min-w-0 flex-col items-center gap-2 px-2 text-center sm:px-4">
          <div className="text-2xl font-semibold tracking-tight text-neutral-950 tabular-nums dark:text-white sm:text-4xl lg:text-5xl">
            <StatsCounter value={stat.value} suffix={stat.suffix} duration={2} />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400 sm:text-xs">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
