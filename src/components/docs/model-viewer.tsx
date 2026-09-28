"use client";

import { ModelViewer } from "@/components/ui/model-viewer";

/**
 * Default demo - drag to rotate, scroll to zoom, arrow keys to rotate
 */
export function ModelViewerDemo() {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg">
            <ModelViewer className="h-full" />
        </div>
    );
}