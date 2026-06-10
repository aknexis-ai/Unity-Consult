"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/resources";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LogoutPage() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    // Swallow logout errors (e.g. "session expired" when already logged out)
    // so they don't surface as an uncaught console exception. Local session
    // state is cleared regardless.
    void authApi
      .logout()
      .catch(() => {})
      .finally(() => {
        clearSession();
        router.push("/login");
      });
  }, [clearSession, router]);

  return <div className="auth-state">Logging out...</div>;
}
