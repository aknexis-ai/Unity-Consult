import "dotenv/config";

import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { resolveAtlasUri } from "../src/common/utils/atlas-uri";

const uri = resolveAtlasUri(process.env.MONGODB_URI).uri;

if (!uri) {
  throw new Error("MONGODB_URI is required before running the seed command.");
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    phone: String,
    company: String,
    title: String,
    avatarUrl: String,
    passwordHash: String,
    role: String,
    hashedRefreshToken: String,
    emailVerified: Boolean,
    emailVerificationOtpHash: String,
    emailVerificationOtpExpiresAt: Date,
    passwordResetTokenHash: String,
    passwordResetTokenExpiresAt: Date,
    isActive: Boolean,
    permissions: [String],
    lastLoginAt: Date,
  },
  { timestamps: true, versionKey: false },
);

const leadSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    company: String,
    service: String,
    stage: String,
    source: String,
    budget: String,
  },
  { timestamps: true, versionKey: false },
);

const orderSchema = new mongoose.Schema(
  {
    clientId: String,
    clientName: String,
    serviceId: String,
    serviceName: String,
    leadId: String,
    amount: Number,
    currency: String,
    stage: String,
    owner: String,
    status: String,
    paymentStatus: String,
    notes: String,
  },
  { timestamps: true, versionKey: false },
);

const projectSchema = new mongoose.Schema(
  {
    orderId: String,
    name: String,
    clientName: String,
    clientEmail: String,
    serviceName: String,
    status: String,
    milestone: String,
    progress: Number,
    dueDate: Date,
    deliverables: [String],
    milestones: [String],
    files: [String],
  },
  { timestamps: true, versionKey: false },
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    clientName: String,
    clientEmail: String,
    serviceName: String,
    amount: Number,
    amountPaid: Number,
    status: String,
    dueDate: Date,
    paidAt: Date,
    providerOrderId: String,
    providerPaymentId: String,
  },
  { timestamps: true, versionKey: false },
);

const documentSchema = new mongoose.Schema(
  {
    name: String,
    ownerId: String,
    category: String,
    mimeType: String,
    fileUrl: String,
    description: String,
    ownerName: String,
    uploadedAt: Date,
  },
  { timestamps: true, versionKey: false },
);

const ticketSchema = new mongoose.Schema(
  {
    subject: String,
    message: String,
    requesterName: String,
    requesterEmail: String,
    priority: String,
    status: String,
  },
  { timestamps: true, versionKey: false },
);

const messageSchema = new mongoose.Schema(
  {
    fromName: String,
    toName: String,
    toUserId: String,
    role: String,
    channel: String,
    message: String,
    projectId: String,
    readAt: Date,
  },
  { timestamps: true, versionKey: false },
);

const teamSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    role: String,
    focus: String,
    status: String,
    permissions: [String],
  },
  { timestamps: true, versionKey: false },
);

const contentSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    status: String,
    summary: String,
  },
  { timestamps: true, versionKey: false },
);

const serviceCatalogSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    name: String,
    category: String,
    short: String,
    description: String,
    priceFrom: String,
    delivery: String,
    outcomes: [String],
    workflow: [String],
    bookingFields: [String],
    related: [String],
    status: String,
  },
  { timestamps: true, versionKey: false },
);

async function upsertMany(model: mongoose.Model<any>, key: string, rows: Array<Record<string, unknown>>) {
  for (const row of rows) {
    await model.updateOne({ [key]: row[key] }, { $set: row }, { upsert: true });
  }
}

async function main() {
  // uri is checked above to ensure it's defined, assert non-null for TypeScript
  await mongoose.connect(uri);

  const User = mongoose.model("User", userSchema);
  const Lead = mongoose.model("Lead", leadSchema);
  const Order = mongoose.model("Order", orderSchema);
  const Project = mongoose.model("Project", projectSchema);
  const Invoice = mongoose.model("Invoice", invoiceSchema);
  const DocumentRecord = mongoose.model("DocumentRecord", documentSchema);
  const Ticket = mongoose.model("Ticket", ticketSchema);
  const Message = mongoose.model("Message", messageSchema);
  const TeamMember = mongoose.model("TeamMember", teamSchema);
  const ContentItem = mongoose.model("ContentItem", contentSchema);
  const ServiceCatalog = mongoose.model("ServiceCatalog", serviceCatalogSchema);

  const passwordHash = await bcrypt.hash("Unity@12345", Number(process.env.BCRYPT_SALT_ROUNDS ?? 12));

  const PERMISSION = {
    DASHBOARD: "dashboard",
    LEADS: "leads",
    ORDERS: "orders",
    SERVICES: "services",
    CONTENT: "content",
    FINANCE: "finance",
    TEAM: "team",
    SUPPORT: "support",
    TICKETS: "tickets",
    AUDIT: "audit",
    USERS: "users",
    PERMISSIONS: "permissions",
    SETTINGS: "settings",
    MESSAGES: "messages",
    DOCUMENTS: "documents",
    PROJECTS: "projects",
    INVOICES: "invoices",
    PAYMENTS: "payments",
  };

  await upsertMany(User, "email", [
    { name: "Super Admin", email: "superadmin@unityconsult.local", phone: "+91 90000 10000", company: "Unity Consult", title: "System Owner", passwordHash, role: "super_admin", emailVerified: true, isActive: true, permissions: Object.values(PERMISSION) },
    { name: "Admin User", email: "admin@unityconsult.local", phone: "+91 90000 10001", company: "Unity Consult", title: "Platform Owner", passwordHash, role: "admin", emailVerified: true, isActive: true, permissions: Object.values(PERMISSION) },
    { name: "Staff User", email: "staff@unityconsult.local", phone: "+91 90000 10002", company: "Unity Consult", title: "Operations Lead", passwordHash, role: "staff", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.LEADS, PERMISSION.ORDERS, PERMISSION.SERVICES, PERMISSION.CONTENT, PERMISSION.TICKETS] },
    { name: "Finance User", email: "finance@unityconsult.local", phone: "+91 90000 10004", company: "Unity Consult", title: "Finance Manager", passwordHash, role: "finance", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.ORDERS, PERMISSION.FINANCE, PERMISSION.INVOICES, PERMISSION.PAYMENTS] },
    { name: "Support User", email: "support@unityconsult.local", phone: "+91 90000 10005", company: "Unity Consult", title: "Support Lead", passwordHash, role: "support", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.SUPPORT, PERMISSION.TICKETS, PERMISSION.MESSAGES] },
    { name: "SEO Specialist", email: "seo@unityconsult.local", phone: "+91 90000 10006", company: "Unity Consult", title: "SEO Strategist", passwordHash, role: "seo", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.SERVICES, PERMISSION.CONTENT] },
    { name: "Design Lead", email: "design@unityconsult.local", phone: "+91 90000 10007", company: "Unity Consult", title: "Design Lead", passwordHash, role: "design", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.SERVICES, PERMISSION.CONTENT] },
    { name: "Content Manager", email: "content@unityconsult.local", phone: "+91 90000 10008", company: "Unity Consult", title: "Content Manager", passwordHash, role: "content", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.SERVICES, PERMISSION.CONTENT] },
    { name: "HR Manager", email: "hr@unityconsult.local", phone: "+91 90000 10009", company: "Unity Consult", title: "HR Manager", passwordHash, role: "hr", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.TEAM] },
    { name: "Operations Manager", email: "operations@unityconsult.local", phone: "+91 90000 10010", company: "Unity Consult", title: "Operations Manager", passwordHash, role: "operations", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.LEADS, PERMISSION.ORDERS] },
    { name: "CRM Ops Lead", email: "crmops@unityconsult.local", phone: "+91 90000 10011", company: "Unity Consult", title: "CRM Operations Lead", passwordHash, role: "crm_ops", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.LEADS, PERMISSION.ORDERS, PERMISSION.SERVICES] },
    { name: "Client User", email: "client@unityconsult.local", phone: "+91 90000 10003", company: "Acme Tech", title: "Founder", passwordHash, role: "client", emailVerified: true, isActive: true, permissions: [PERMISSION.DASHBOARD, PERMISSION.PROJECTS, PERMISSION.DOCUMENTS, PERMISSION.INVOICES, PERMISSION.PAYMENTS, PERMISSION.MESSAGES, PERMISSION.SETTINGS, PERMISSION.SUPPORT] },
  ]);

  await upsertMany(Lead, "email", [
    { name: "Aarav Mehta", email: "aarav@example.com", company: "Acme Tech", service: "Web Development", stage: "new", source: "Booking", budget: "Rs 1L - Rs 3L" },
    { name: "Nisha Rao", email: "nisha@example.com", company: "GrowthHub", service: "SEO Services", stage: "qualified", source: "Contact", budget: "Monthly retainer" },
    { name: "Kabir Sen", email: "kabir@example.com", company: "NextGen Ops", service: "CRM Development", stage: "proposal", source: "Referral", budget: "Rs 3L+" },
  ]);

  await upsertMany(Order, "clientName", [
    { clientName: "Acme Tech", serviceId: "web-development", serviceName: "Web Development", amount: 99999, currency: "INR", stage: "Architecture", owner: "Priya Sharma", status: "active", paymentStatus: "pending", notes: "Advance invoice issued and architecture review scheduled." },
    { clientName: "GrowthHub", serviceId: "seo-services", serviceName: "SEO Services", amount: 19999, currency: "INR", stage: "Monthly Optimization", owner: "Arjun Patel", status: "active", paymentStatus: "paid", notes: "Monthly retainer active for Q2." },
  ]);

  await upsertMany(Project, "name", [
    { name: "Corporate Website Refresh", clientName: "Acme Tech", clientEmail: "client@unityconsult.local", serviceName: "Web Development", status: "active", milestone: "Design approval", progress: 45, dueDate: new Date("2026-06-20"), deliverables: ["Sitemap", "Design system", "Frontend build"], milestones: ["Discovery complete", "Architecture approved", "Design approval"], files: ["/documents/project-proposal.pdf"] },
    { name: "SEO Retainer Q2", clientName: "GrowthHub", clientEmail: "client@unityconsult.local", serviceName: "SEO Services", status: "active", milestone: "Technical audit", progress: 60, dueDate: new Date("2026-06-05"), deliverables: ["Audit", "Keyword map", "Monthly report"], milestones: ["Audit started", "Keyword map approved"], files: ["/documents/seo-audit.pdf"] },
  ]);

  await upsertMany(Invoice, "invoiceNumber", [
    { invoiceNumber: "INV-001", clientName: "Acme Tech", clientEmail: "client@unityconsult.local", serviceName: "Web Development", amount: 99999, amountPaid: 0, status: "issued", dueDate: new Date("2026-06-01") },
    { invoiceNumber: "INV-002", clientName: "GrowthHub", clientEmail: "client@unityconsult.local", serviceName: "SEO Services", amount: 19999, amountPaid: 19999, status: "paid", dueDate: new Date("2026-05-30"), paidAt: new Date("2026-05-20") },
  ]);

  await upsertMany(DocumentRecord, "name", [
    { name: "Project Proposal.pdf", category: "contract", mimeType: "application/pdf", fileUrl: "/documents/project-proposal.pdf", description: "Signed project proposal and commercial scope", ownerName: "Acme Tech", uploadedAt: new Date("2026-05-18") },
    { name: "SEO Audit.pdf", category: "deliverable", mimeType: "application/pdf", fileUrl: "/documents/seo-audit.pdf", description: "Initial technical audit and opportunity map", ownerName: "GrowthHub", uploadedAt: new Date("2026-05-19") },
  ]);

  await upsertMany(Ticket, "subject", [
    { subject: "Homepage copy revision", message: "Please revise hero copy before approval.", requesterName: "Client User", requesterEmail: "client@unityconsult.local", priority: "medium", status: "open" },
    { subject: "Invoice payment confirmation", message: "Payment proof uploaded for review.", requesterName: "Client User", requesterEmail: "client@unityconsult.local", priority: "high", status: "in_progress" },
  ]);

  await upsertMany(Message, "message", [
    { fromName: "Priya Sharma", toName: "Client User", role: "staff", channel: "portal", message: "Design review is ready for your approval.", projectId: null },
    { fromName: "Client User", toName: "Unity Consult Team", role: "client", channel: "portal", message: "We reviewed the milestone and added comments.", projectId: null },
  ]);

  await upsertMany(TeamMember, "email", [
    { name: "Priya Sharma", email: "priya@unityconsult.local", role: "Project Lead", focus: "Web and portal delivery", status: "active", permissions: ["projects:write", "documents:write", "messages:write"] },
    { name: "Arjun Patel", email: "arjun@unityconsult.local", role: "Growth Strategist", focus: "SEO and paid acquisition", status: "active", permissions: ["leads:write", "analytics:read", "content:write"] },
  ]);

  await upsertMany(ContentItem, "title", [
    { title: "Homepage trust section", type: "Landing Page", status: "draft", summary: "PRD-aligned proof surface" },
    { title: "CRM roadmap article", type: "Blog", status: "published", summary: "Authority content for operations teams" },
  ]);

  await upsertMany(ServiceCatalog, "slug", [
    {
      slug: "web-development",
      name: "Web Development",
      category: "Technology",
      short: "Conversion-ready websites and web applications.",
      description: "Strategy, UX, frontend, backend, analytics, and launch support for growth-focused sites.",
      priceFrom: "Rs 99,999",
      delivery: "4-10 weeks",
      outcomes: ["Responsive site", "CMS-ready content", "Analytics setup", "Launch support"],
      workflow: ["Discovery", "Architecture", "Design", "Development", "QA", "Launch"],
      bookingFields: ["Business name", "Project goals", "Page count", "Feature list", "Budget range"],
      related: ["crm-development", "seo-services", "branding-design"],
      status: "active",
    },
    {
      slug: "crm-development",
      name: "CRM Development",
      category: "Operations",
      short: "Custom CRM workflows for leads, orders, support, and delivery.",
      description: "Role-based operational systems with dashboards, automations, and reporting.",
      priceFrom: "Rs 2,49,999",
      delivery: "6-12 weeks",
      outcomes: ["Workflow mapping", "Role-based access", "Reporting layer", "Training handover"],
      workflow: ["Requirements", "Architecture", "Module planning", "Implementation", "UAT", "Deploy"],
      bookingFields: ["Team size", "Current tools", "Required modules", "Integrations", "Timeline"],
      related: ["web-development", "digital-marketing", "legal-registration"],
      status: "active",
    },
    {
      slug: "seo-services",
      name: "SEO Services",
      category: "Growth",
      short: "Technical, local, and content SEO programs.",
      description: "Search visibility programs with audits, keyword maps, content plans, and monthly reports.",
      priceFrom: "Rs 19,999/mo",
      delivery: "Ongoing",
      outcomes: ["SEO audit", "Keyword strategy", "Content roadmap", "Monthly reporting"],
      workflow: ["Audit", "Keyword mapping", "On-page fixes", "Content", "Reporting", "Iteration"],
      bookingFields: ["Website URL", "Target cities", "Target keywords", "CMS access", "Goals"],
      related: ["digital-marketing", "web-development", "branding-design"],
      status: "active",
    },
    {
      slug: "digital-marketing",
      name: "Digital Marketing",
      category: "Growth",
      short: "Campaign funnels, paid media, and conversion optimization.",
      description: "Performance marketing systems with channel strategy, creative testing, and conversion reporting.",
      priceFrom: "Rs 29,999/mo",
      delivery: "2-4 weeks setup",
      outcomes: ["Channel strategy", "Tracking plan", "Creative direction", "Performance reports"],
      workflow: ["Strategy", "Account setup", "Creative", "Launch", "Testing", "Scale"],
      bookingFields: ["Offer", "Channels", "Budget", "Target geography", "Creative assets"],
      related: ["seo-services", "branding-design", "crm-development"],
      status: "active",
    },
    {
      slug: "legal-registration",
      name: "Legal Registration",
      category: "Compliance",
      short: "Business registration, compliance support, and document workflows.",
      description: "Structured legal registration assistance with checklist, document review, filing support, and handover.",
      priceFrom: "Rs 9,999",
      delivery: "1-3 weeks",
      outcomes: ["Document checklist", "Filing support", "Status visibility", "Archive handover"],
      workflow: ["Checklist", "Document review", "Portal submission", "Tracking", "Certificate handover"],
      bookingFields: ["Business type", "Founders", "Required registration", "Documents available", "Urgency"],
      related: ["branding-design", "crm-development", "web-development"],
      status: "active",
    },
    {
      slug: "branding-design",
      name: "Branding & Design",
      category: "Brand",
      short: "Identity systems, brand kits, and rollout assets.",
      description: "Positioning-led brand identity systems with visual direction, asset kits, and launch-ready collateral.",
      priceFrom: "Rs 49,999",
      delivery: "2-6 weeks",
      outcomes: ["Brand direction", "Visual system", "Asset kit", "Handover package"],
      workflow: ["Discovery", "Moodboards", "Concepts", "Refinement", "Final files", "Asset rollout"],
      bookingFields: ["Brand stage", "Audience", "Deliverables", "Preferred style", "Deadline"],
      related: ["web-development", "digital-marketing", "seo-services"],
      status: "active",
    },
  ]);

  await mongoose.disconnect();
  console.log("Seed completed. Demo users use password: Unity@12345");
}

void main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
