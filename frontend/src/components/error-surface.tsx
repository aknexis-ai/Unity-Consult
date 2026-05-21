"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home, RefreshCcw, ShieldAlert } from "lucide-react";

type ErrorSurfaceProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
  onRetry?: () => void;
  tone?: "warning" | "critical" | "not-found";
};

export function ErrorSurface({
  eyebrow,
  title,
  description,
  actionLabel = "Try again",
  onRetry,
  tone = "warning",
}: ErrorSurfaceProps) {
  const Icon = tone === "critical" ? ShieldAlert : AlertTriangle;

  return (
    <main className="error-page">
      <section className="error-panel">
        <div className="error-icon">
          <Icon size={28} />
        </div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="button-row">
          {onRetry ? (
            <button type="button" className="primary-button" onClick={onRetry}>
              <RefreshCcw size={16} />
              {actionLabel}
            </button>
          ) : null}
          <Link href="/" className="ghost-button">
            <Home size={16} />
            Go home
          </Link>
          <Link href="/contact" className="ghost-button">
            <ArrowLeft size={16} />
            Contact support
          </Link>
        </div>
      </section>
    </main>
  );
}
