"use client";

import { useEffect } from "react";

import { ErrorSurface } from "@/components/error-surface";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorSurface
      eyebrow="Application error"
      title="Something interrupted this workspace."
      description="The app caught an unexpected issue while loading this view. You can retry safely."
      actionLabel="Reload view"
      onRetry={reset}
      tone="critical"
    />
  );
}
