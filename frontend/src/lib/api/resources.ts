"use client";

import { apiClient } from "./client";
import type {
  ApiUser,
  AuditLog,
  BookingResult,
  ContentItem,
  DocumentRecord,
  Invoice,
  Lead,
  Metric,
  Order,
  PortalMessage,
  Project,
  ServiceCatalogItem,
  TeamMember,
  Ticket,
} from "./types";

export const authApi = {
  login: async (input: { email: string; password: string }) => {
    const response = await apiClient.post<{ user: ApiUser; tokens: { accessToken: string } }>("/auth/login", input);
    return response.data;
  },
  register: async (input: { name: string; email: string; phone?: string; password: string; role?: string }) => {
    const response = await apiClient.post<{ user: ApiUser; tokens: { accessToken: string } }>("/auth/register", input);
    return response.data;
  },
  requestEmailOtp: async (input: { email: string }) => {
    const response = await apiClient.post<{ success: boolean; alreadyVerified?: boolean; devOtp?: string }>("/auth/request-email-otp", input);
    return response.data;
  },
  verifyEmail: async (input: { email: string; otp: string }) => {
    const response = await apiClient.post<{ success: boolean; alreadyVerified?: boolean }>("/auth/verify-email", input);
    return response.data;
  },
  forgotPassword: async (input: { email: string }) => {
    const response = await apiClient.post<{ success: boolean; devResetToken?: string }>("/auth/forgot-password", input);
    return response.data;
  },
  resetPassword: async (input: { email: string; token: string; password: string }) => {
    const response = await apiClient.post<{ success: boolean }>("/auth/reset-password", input);
    return response.data;
  },
  me: async () => {
    const response = await apiClient.get<{ user: ApiUser }>("/auth/me");
    return response.data.user;
  },
  logout: async () => {
    const response = await apiClient.post<{ success: boolean }>("/auth/logout");
    return response.data;
  },
};

export const liveApi = {
  adminMetrics: () => apiClient.get<Metric[]>("/analytics/admin").then((response) => response.data),
  portalMetrics: () => apiClient.get<Metric[]>("/analytics/portal").then((response) => response.data),
  leads: () => apiClient.get<Lead[]>("/leads").then((response) => response.data),
  lead: (id: string) => apiClient.get<Lead>(`/leads/${id}`).then((response) => response.data),
  createLead: (input: Partial<Lead>) => apiClient.post<Lead>("/leads", input).then((response) => response.data),
  updateLeadStage: (id: string, stage: Lead["stage"]) =>
    apiClient.patch<Lead>(`/leads/${id}/stage`, { stage }).then((response) => response.data),
  createBooking: (input: {
    companyName: string;
    contactEmail: string;
    contactPhone: string;
    serviceSlug: string;
    serviceName: string;
    priceLabel: string;
    amount?: number;
    projectBrief: string;
    deliveryNotes: string;
    requestedFields?: Record<string, string>;
  }) => apiClient.post<BookingResult>("/bookings", input).then((response) => response.data),
  orders: () => apiClient.get<Order[]>("/orders").then((response) => response.data),
  order: (id: string) => apiClient.get<Order>(`/orders/${id}`).then((response) => response.data),
  projects: () => apiClient.get<Project[]>("/projects").then((response) => response.data),
  project: (id: string) => apiClient.get<Project>(`/projects/${id}`).then((response) => response.data),
  invoices: () => apiClient.get<Invoice[]>("/invoices").then((response) => response.data),
  invoice: (id: string) => apiClient.get<Invoice>(`/invoices/${id}`).then((response) => response.data),
  documents: () => apiClient.get<DocumentRecord[]>("/documents").then((response) => response.data),
  uploadDocument: (input: {
    name: string;
    ownerName: string;
    category?: string;
    description?: string;
    mimeType: string;
    data: string;
  }) => apiClient.post<DocumentRecord>("/documents/upload", input).then((response) => response.data),
  tickets: () => apiClient.get<Ticket[]>("/tickets").then((response) => response.data),
  createTicket: (input: Partial<Ticket>) => apiClient.post<Ticket>("/tickets", input).then((response) => response.data),
  messages: () => apiClient.get<PortalMessage[]>("/messages").then((response) => response.data),
  projectMessages: (projectId: string) =>
    apiClient.get<PortalMessage[]>("/messages", { params: { projectId } }).then((response) => response.data),
  createMessage: (input: Partial<PortalMessage>) =>
    apiClient.post<PortalMessage>("/messages", input).then((response) => response.data),
  team: () => apiClient.get<TeamMember[]>("/team").then((response) => response.data),
  servicesCatalog: () => apiClient.get<ServiceCatalogItem[]>("/services").then((response) => response.data),
  createServiceCatalog: (input: Partial<ServiceCatalogItem>) =>
    apiClient.post<ServiceCatalogItem>("/services", input).then((response) => response.data),
  updateServiceCatalog: (slug: string, input: Partial<ServiceCatalogItem>) =>
    apiClient.patch<ServiceCatalogItem>(`/services/${slug}`, input).then((response) => response.data),
  deleteServiceCatalog: (slug: string) =>
    apiClient.delete<{ success: boolean }>(`/services/${slug}`).then((response) => response.data),
  content: () => apiClient.get<ContentItem[]>("/content").then((response) => response.data),
  createContent: (input: Partial<ContentItem>) =>
    apiClient.post<ContentItem>("/content", input).then((response) => response.data),
  updateContent: (id: string, input: Partial<ContentItem>) =>
    apiClient.patch<ContentItem>(`/content/${id}`, input).then((response) => response.data),
  deleteContent: (id: string) =>
    apiClient.delete<{ success: boolean }>(`/content/${id}`).then((response) => response.data),
  providerHealth: () => apiClient.get<Record<string, unknown>>("/health/providers").then((response) => response.data),
  auditLogs: () => apiClient.get<AuditLog[]>("/audit").then((response) => response.data),
  mySettings: () =>
    apiClient
      .get<{
        notifications: boolean;
        billingAlerts: boolean;
        weeklyDigest: boolean;
        locale: string;
        timezone: string;
      }>("/settings/me")
      .then((response) => response.data),
  updateMySettings: (input: Partial<{ notifications: boolean; billingAlerts: boolean; weeklyDigest: boolean; locale: string; timezone: string }>) =>
    apiClient.patch("/settings/me", input).then((response) => response.data),
  createPaymentOrder: (input: { invoiceId: string; amount: number; currency?: string }) =>
    apiClient.post("/payments/create-order", input).then((response) => response.data),
};
