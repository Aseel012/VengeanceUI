import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface CandyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  tone?: "blue" | "neutral";
}

export function CandyButton({ asChild = false, tone = "blue", className, children = "Candy Button", ...props }: CandyButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-semibold text-base leading-[22px] tracking-[0.02em]",
        "px-9 py-3 rounded-xl cursor-pointer transition-all duration-200 ease-out",
        "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground",
        "active:scale-95 active:rotate-1",
        "after:absolute after:top-[1px] after:right-[10%] after:w-[60%] after:h-[1px]",
        "after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent",
        "hover:brightness-110",
        tone === "blue"
          ? "border-[#54A1FD] bg-[radial-gradient(95%_60%_at_50%_75%,#005FD6_0%,#209BFF_100%)] text-white shadow-[0px_4px_48px_-12px_#1187FF,inset_0px_1px_8px_-4px_#FFFFFF]"
          : "border-zinc-300 bg-[radial-gradient(95%_85%_at_50%_75%,#e4e4e7_0%,#ffffff_100%)] text-zinc-950 shadow-[0_5px_22px_-12px_rgba(0,0,0,0.35),inset_0_1px_5px_-3px_#fff] dark:border-zinc-600 dark:bg-[radial-gradient(95%_85%_at_50%_75%,#18181b_0%,#3f3f46_100%)] dark:text-white dark:shadow-[0_5px_28px_-12px_rgba(255,255,255,0.24),inset_0_1px_6px_-3px_#fff]",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default CandyButton;
