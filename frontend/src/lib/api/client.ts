"use client";

import axios from "axios";

import { useAuthStore } from "../stores/auth-store";

function resolveApiBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

  if (typeof window === "undefined") {
    return configuredUrl;
  }

  try {
    const url = new URL(configuredUrl);
    const localHosts = new Set(["localhost", "127.0.0.1"]);

    if (localHosts.has(window.location.hostname) && localHosts.has(url.hostname)) {
      url.hostname = window.location.hostname;
      return url.toString().replace(/\/$/, "");
    }
  } catch {
    return configuredUrl;
  }

  return configuredUrl;
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  timeout: 15_000,
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

  if (!token) {
    throw new Error("CSRF token could not be issued.");
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

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (!error.response) {
      return Promise.reject(
        new Error("Backend API is not reachable. Start the backend on http://127.0.0.1:4000 and check MongoDB Atlas connectivity."),
      );
    }

    if (error.response?.status !== 401 || !originalRequest) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : Array.isArray(error.response?.data?.message)
            ? error.response.data.message.join(" ")
            : error.message;
      return Promise.reject(new Error(message));
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      useAuthStore.getState().clearSession();
      return Promise.reject(new Error("Your session has expired. Please login again."));
    }

    if (originalRequest._retry) {
      return new Promise<string | null>((resolve) => {
        refreshSubscribers.push(resolve);
      }).then((token) => {
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
        return Promise.reject(new Error("Your session has expired. Please login again."));
      });
    }

    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const response = await apiClient.post("/auth/refresh", {});
        const accessToken = response.data?.tokens?.accessToken as string | undefined;
        const user = response.data?.user;

        if (accessToken && user) {
          useAuthStore.getState().setSession({ accessToken, user });
          onRefreshed(accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }

        useAuthStore.getState().clearSession();
        onRefreshed(null);
        return Promise.reject(new Error("Your session has expired. Please login again."));
      } catch {
        useAuthStore.getState().clearSession();
        onRefreshed(null);
        return Promise.reject(new Error("Your session has expired. Please login again."));
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise<string | null>((resolve) => {
      refreshSubscribers.push(resolve);
    }).then((token) => {
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      }
      return Promise.reject(new Error("Your session has expired. Please login again."));
    });
  },
);
