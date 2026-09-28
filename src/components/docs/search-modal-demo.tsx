"use client";

import { useState } from "react";
import { ChatTeardropText, EnvelopeSimple, ListPlus, MagnifyingGlass } from "@phosphor-icons/react";
import { SearchModal, type SearchResult } from "@/components/ui/search-modal";

/**
 * Preview for the Search Modal in modal mode: press ⌘K / Ctrl+K (or click the
 * field) to open, Escape or the backdrop to close. Type to live-filter the
 * results. The panel adapts to light and dark mode.
 */
const RESULTS: SearchResult[] = [
  {
    name: "Jason Woordheart",
    meta: "jason@dribbble.com",
    avatar: "/avatars/johan.jpg",
    actions: [
      { icon: <ChatTeardropText className="h-4 w-4" />, label: "Message" },
      { icon: <ListPlus className="h-4 w-4" />, label: "Add to list" },
    ],
  },
  {
    name: "Rob Miller",
    meta: "rob@icloud.com",
    avatar: "/avatars/shinji.jpg",
    actions: [{ icon: <ListPlus className="h-4 w-4" />, label: "Add to list" }],
  },
  {
    name: "Hannah Steward",
    meta: "replied on thread",
    avatar: "/avatars/aizen.jpg",
    actions: [
      { icon: <EnvelopeSimple className="h-4 w-4" />, label: "Email" },
      { icon: <ListPlus className="h-4 w-4" />, label: "Add to list" },
    ],
  },
];

export function SearchModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden bg-neutral-50 p-8 dark:bg-neutral-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]"
      />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex w-full max-w-sm items-center gap-2 rounded-xl border border-black/[0.08] bg-white/70 px-3.5 py-2.5 text-sm text-neutral-400 shadow-sm transition-colors hover:border-black/[0.14] dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-500 dark:hover:border-white/20"
      >
        <MagnifyingGlass className="h-[18px] w-[18px]" />
        <span>Search…</span>
        <kbd className="ml-auto flex items-center gap-0.5 rounded-md border border-black/[0.06] bg-black/[0.03] px-1.5 py-0.5 font-sans text-[11px] font-medium dark:border-white/[0.08] dark:bg-white/[0.06]">
          <span className="text-[13px] leading-none">⌘</span>K
        </kbd>
      </button>
      <p className="relative text-xs text-neutral-400 dark:text-neutral-600">
        Press <span className="font-medium text-neutral-500 dark:text-neutral-400">⌘K</span> to toggle
      </p>

      <SearchModal
        modal
        open={open}
        onOpenChange={setOpen}
        results={RESULTS}
        overlayClassName="absolute items-center p-6"
      />
    </div>
  );
}

export default SearchModalDemo;
