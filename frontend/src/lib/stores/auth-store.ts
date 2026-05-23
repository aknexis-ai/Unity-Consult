"use client";

import { create } from "zustand";

const storageKey = "unity_consult_auth_session";
export type AuthRole =
  | "super_admin"
  | "admin"
  | "finance"
  | "support"
  | "seo"
  | "design"
  | "content"
  | "hr"
  | "operations"
  | "crm_ops"
  | "staff"
  | "client";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  title?: string | null;
  avatarUrl?: string | null;
  role: AuthRole;
  permissions: string[];
} | null;

type AuthState = {
  accessToken: string | null;
  user: AuthUser;
  setSession: (input: { accessToken: string; user: NonNullable<AuthUser> }) => void;
  clearSession: () => void;
};

function readStoredSession(): Pick<AuthState, "accessToken" | "user"> {
  if (typeof window === "undefined") {
    return { accessToken: null, user: null };
  }

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return { accessToken: null, user: null };
    }

    const parsed = JSON.parse(raw) as Partial<Pick<AuthState, "accessToken" | "user">>;

    if (typeof parsed.accessToken !== "string" || !parsed.user) {
      return { accessToken: null, user: null };
    }

    return {
      accessToken: parsed.accessToken,
      user: parsed.user,
    };
  } catch {
    return { accessToken: null, user: null };
  }
}

function storeSession(session: Pick<AuthState, "accessToken" | "user">) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(storageKey);
}

const initialSession = readStoredSession();

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: initialSession.accessToken,
  user: initialSession.user,
  setSession: ({ accessToken, user }) => {
    storeSession({ accessToken, user });
    set({ accessToken, user });
  },
  clearSession: () => {
    clearStoredSession();
    set({ accessToken: null, user: null });
  },
}));
