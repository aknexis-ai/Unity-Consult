"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/resources";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LogoutPage() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    void authApi.logout().finally(() => {
      clearSession();
      router.push("/login");
    });
  }, [clearSession, router]);

  return <div className="auth-state">Logging out...</div>;
}
