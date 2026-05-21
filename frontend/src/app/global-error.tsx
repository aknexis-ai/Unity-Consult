"use client";

import { ErrorSurface } from "@/components/error-surface";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <ErrorSurface
          eyebrow="System error"
          title="The platform shell could not finish loading."
          description="This is a protected fallback for rare startup or layout failures."
          actionLabel="Restart shell"
          onRetry={reset}
          tone="critical"
        />
      </body>
    </html>
  );
}
