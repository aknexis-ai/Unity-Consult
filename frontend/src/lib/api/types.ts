export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  title?: string | null;
  avatarUrl?: string | null;
  role:
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
  permissions: string[];
  emailVerified?: boolean;
  isActive: boolean;
  lastLoginAt?: string | null;
};

export type Lead = {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service: string;
  stage: "new" | "qualified" | "proposal" | "won";
  source?: string | null;
  budget?: string | null;
  budgetRange?: string | null;
  inquiryType?: string | null;
  message?: string | null;
  serviceInterest?: string | null;
};

export type Project = {
  _id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  status: string;
  milestone: string;
  dueDate?: string | null;
  deliverables: string[];
};

export type Order = {
  _id: string;
  clientName: string;
  serviceName: string;
  stage: string;
  owner?: string | null;
  status: string;
  paymentMode?: string | null;
  paymentStatus?: string | null;
};

export type Invoice = {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  amount: number;
  amountPaid: number;
  status: string;
  dueDate?: string | null;
};

export type DocumentRecord = {
  _id: string;
  name: string;
  category: string;
  fileUrl: string;
  description?: string | null;
  ownerName: string;
  updatedAt?: string;
};

export type Ticket = {
  _id: string;
  subject: string;
  message: string;
  requesterName: string;
  requesterEmail: string;
  priority: string;
  status: string;
};

export type PortalMessage = {
  _id: string;
  fromName: string;
  toName?: string | null;
  toUserId?: string | null;
  role: string;
  channel?: string;
  message: string;
  projectId?: string | null;
  createdAt?: string;
};

export type TeamMember = {
  _id: string;
  name: string;
  email?: string;
  role: string;
  focus: string;
  status: string;
  permissions?: string[];
};

export type ContentItem = {
  _id: string;
  title: string;
  type: string;
  status: string;
  summary?: string | null;
  imageId?: string | null;
  imageUrl?: string | null;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
};

export type ServiceCatalogItem = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  short: string;
  description: string;
  priceFrom: string;
  delivery: string;
  outcomes: string[];
  workflow: string[];
  bookingFields: string[];
  related: string[];
  status: string;
  accent?: string;
  proofMetric?: string;
  proofLabel?: string;
  pricingTiers?: Array<Record<string, unknown>>;
  addons?: Array<Record<string, unknown>>;
  deliverables?: string[];
  faqs?: Array<Record<string, unknown>>;
  intakeSchema?: Array<Record<string, unknown>>;
  media?: Record<string, unknown>;
  seo?: Record<string, unknown>;
};

export type BookingResult = {
  lead: Lead;
  order: Order;
  project: Project;
  invoice: Invoice;
  invoices?: Invoice[];
  nextAction: "payment";
};

export type AuditLog = {
  _id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  actorId?: string | null;
  actorRole?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: string;
};
