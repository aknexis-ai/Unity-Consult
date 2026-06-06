"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/lib/api/resources";
import { AuthRole, useAuthStore } from "@/lib/stores/auth-store";

export function AuthGate({
  roles,
  children,
}: {
  roles: AuthRole[];
  children: ReactNode;
}) {
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const storedUser = useAuthStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);
  const query = useQuery({
    queryKey: ["auth", "me", accessToken],
    queryFn: authApi.me,
    retry: false,
    enabled: isMounted && !!accessToken,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (query.data && accessToken) {
      setSession({ accessToken, user: query.data });
    }
  }, [accessToken, query.data, setSession]);

  useEffect(() => {
    if (query.error) {
      useAuthStore.getState().clearSession();
    }
  }, [query.error]);

  const user = query.error ? null : (query.data ?? storedUser);
  const isBootstrappingSession = !isMounted || (!!accessToken && query.isLoading);

  if (isBootstrappingSession) {
    return <div className="auth-state">Checking your session...</div>;
  }

  if ((query.error || (isMounted && !accessToken)) && !user) {
    return (
      <div className="auth-state">
        <div className="portal-gate-wrapper container stack-lg">
          <Link href="/" className="auth-back-link" style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </Link>
          <div className="auth-panel-heading">
            <div className="error-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-lock"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2>Client workspace is locked</h2>
            <p className="hero-copy">
              Please sign in to access your dashboard, track active service deliveries, and collaborate with your consulting partners.
            </p>
            <div className="button-row">
              <Link href="/login" className="primary-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-log-in"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" x2="3" y1="12" y2="12" />
                </svg>
                Access Workspace
              </Link>
              <Link href="/register" className="ghost-button">
                Create Account
              </Link>
            </div>
          </div>

          <div className="portal-features-showcase card">
            <h3>What awaits inside your secure portal</h3>
            <p className="section-description">
              Once authenticated, your client workspace activates a comprehensive command center built around your active service agreements:
            </p>
            <div className="feature-grid">
              <article className="card inset-card">
                <div style={{ color: "var(--accent)", marginBottom: "0.85rem", display: "inline-block" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-briefcase"
                  >
                    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    <rect width="20" height="14" x="2" y="6" rx="2" />
                  </svg>
                </div>
                <h4>Live Project Tracking</h4>
                <p>Monitor your web projects, CRM setups, or branding campaigns through step-by-step deliverable status maps.</p>
              </article>
              <article className="card inset-card">
                <div style={{ color: "var(--primary)", marginBottom: "0.85rem", display: "inline-block" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-file-text"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>
                </div>
                <h4>Secure Document Vault</h4>
                <p>Instantly retrieve signed agreements, regulatory filing proofs, design exports, and final source handovers.</p>
              </article>
              <article className="card inset-card">
                <div style={{ color: "var(--accent)", marginBottom: "0.85rem", display: "inline-block" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-credit-card"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <h4>Financial Command</h4>
                <p>Symmetrically manage retainer invoices, make fast online payments, and download complete receipts history.</p>
              </article>
              <article className="card inset-card">
                <div style={{ color: "var(--primary)", marginBottom: "0.85rem", display: "inline-block" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-message-square"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h4>Direct Team Access</h4>
                <p>Collaborate in real time with your dedicated developers, submit support requests, and resolve feedback questions.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-state">
        <h2>Access restricted</h2>
        <p>Your current session could not be loaded.</p>
        <Link href="/login" className="ghost-button">
          Go to login
        </Link>
      </div>
    );
  }

  const isSuperAdmin = user.role === "super_admin";

  if (!isSuperAdmin && !roles.includes(user.role)) {
    return (
      <div className="auth-state">
        <h2>Access restricted</h2>
        <p>Your current role cannot access this workspace.</p>
        <Link href="/" className="ghost-button">
          Go home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
