"use client";

import * as React from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { TabsContext } from "@/components/ui/tabs";

interface SourceResponse {
  code: string;
  html: string;
  fileName: string;
}

interface RequestState {
  componentName: string;
  source: SourceResponse | null;
  error: string | null;
}

export function DeferredHighlightedCodeBlock({ componentName }: { componentName: string }) {
  const { activeTab } = React.useContext(TabsContext);
  const [requestState, setRequestState] = React.useState<RequestState | null>(null);
  const activeRequest = requestState?.componentName === componentName ? requestState : null;

  React.useEffect(() => {
    if (activeTab !== "code" || activeRequest) return;

    const controller = new AbortController();

    async function loadSource() {
      try {
        const response = await fetch(`/api/component-code/${encodeURIComponent(componentName)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Source returned ${response.status}`);
        const source = (await response.json()) as SourceResponse;
        setRequestState({ componentName, source, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        setRequestState({
          componentName,
          source: null,
          error: error instanceof Error ? error.message : "Unable to load source code",
        });
      }
    }

    loadSource();
    return () => controller.abort();
  }, [activeTab, activeRequest, componentName]);

  if (activeRequest?.error) {
    return <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">Source code could not be loaded: {activeRequest.error}.</div>;
  }

  if (!activeRequest?.source) {
    return <div role="status" className="flex min-h-40 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-sm text-neutral-500 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">Loading source code…</div>;
  }

  const { code, html, fileName } = activeRequest.source;

  return (
    <div className="group/code relative my-6 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 shadow-sm dark:border-zinc-800/80 dark:bg-black">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono font-medium text-neutral-500 dark:text-zinc-300">{fileName}</span>
        </div>
        <CopyButton code={code} className="flex h-7 w-7 items-center justify-center rounded-sm border-none bg-transparent text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 [&>svg]:h-3.5 [&>svg]:w-3.5" />
      </div>
      <div
        className="[counter-reset:css-counter] overflow-x-auto p-4 font-mono text-sm leading-relaxed scrollbar-hide selection:bg-neutral-200 selection:text-black dark:selection:bg-zinc-800 dark:selection:text-white [&>pre]:!m-0 [&>pre]:!bg-transparent [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
