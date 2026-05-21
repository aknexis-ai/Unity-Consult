import { ErrorSurface } from "@/components/error-surface";

export default function NotFound() {
  return (
    <ErrorSurface
      eyebrow="404"
      title="This page is not on the current project map."
      description="The route may have moved, the link may be incomplete, or this workspace may not be available yet."
      tone="not-found"
    />
  );
}
