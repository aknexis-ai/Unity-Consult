"use client";

import axios from "axios";

import { useAuthStore } from "../stores/auth-store";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/api/v1";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

const unsafeMethods = new Set(["post", "put", "patch", "delete"]);

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? null
  );
}

async function ensureCsrfToken() {
  let token = readCookie("unity_csrf_token");

  if (!token) {
    const response = await apiClient.get<{ csrfToken: string }>("/auth/csrf");
    token = response.data.csrfToken;
  }

  return token;
}

apiClient.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const method = config.method?.toLowerCase();

  if (method && unsafeMethods.has(method) && !config.url?.includes("/auth/csrf")) {
    const csrfToken = await ensureCsrfToken();
    config.headers["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (!error.response) {
      return Promise.reject(
        new Error("Backend API is not reachable. Start the backend on http://127.0.0.1:4000 and check MongoDB Atlas connectivity."),
      );
    }

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : Array.isArray(error.response?.data?.message)
            ? error.response.data.message.join(" ")
            : error.message;
      return Promise.reject(new Error(message));
    }

    originalRequest._retry = true;

    refreshPromise ??= apiClient
      .post("/auth/refresh", {})
      .then((response) => {
        const accessToken = response.data?.tokens?.accessToken as string | undefined;
        const user = response.data?.user;

        if (accessToken && user) {
          useAuthStore.getState().setSession({ accessToken, user });
          return accessToken;
        }

        useAuthStore.getState().clearSession();
        return null;
      })
      .catch(() => {
        useAuthStore.getState().clearSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });

    const refreshedAccessToken = await refreshPromise;

    if (!refreshedAccessToken) {
      return Promise.reject(new Error("Your session has expired. Please login again."));
    }

    originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;
    return apiClient(originalRequest);
  },
);
