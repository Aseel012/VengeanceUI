"use client";

import React, { useRef } from "react";
import { ScrollDissolveReveal } from "@/components/ui/scroll-dissolve-reveal";

export default function ScrollDissolveRevealDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={scrollRef} className="w-full h-full overflow-y-auto relative bg-zinc-950">
      <div className="h-full w-full flex items-center justify-center text-white flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tighter">Scroll Down</h1>
        <p className="text-zinc-500">To see the dissolve reveal effect</p>
      </div>
      
      <ScrollDissolveReveal
        scrollContainerRef={scrollRef}
        containerClassName="h-[300%]"
        className="h-1/3"
        imageFront="https://images.unsplash.com/photo-1577081395884-e70fc91645ad?q=80&w=1134&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageBack="https://images.unsplash.com/photo-1705167110557-a16203e0fe24?q=80&w=1274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      
      <div className="h-full w-full flex items-center justify-center text-white flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tighter">End of Effect</h1>
        <p className="text-zinc-500">Scroll up to reverse</p>
      </div>
    </div>
  );
}
