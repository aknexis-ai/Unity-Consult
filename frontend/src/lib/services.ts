export type PricingTier = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export type ServiceAddon = {
  name: string;
  price: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceMedia = {
  hero: string;
  card: string;
  alt: string;
};

export type ServiceSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: string;
  priceFrom: string;
  delivery: string;
  accent: string;
  proofMetric: string;
  proofLabel: string;
  outcomes: string[];
  workflow: string[];
  bookingFields: string[];
  related: string[];
  pricingTiers: PricingTier[];
  addons: ServiceAddon[];
  deliverables: string[];
  faqs: ServiceFaq[];
  intakeSchema: string[];
  media: ServiceMedia;
  seo: ServiceSeo;
};

export const services: Service[] = [
  {
    slug: "web-development",
    name: "Web Development",
    short: "Conversion-focused company websites, portals, and business platforms.",
    description:
      "Premium website and web-app delivery for companies that need trust, speed, conversion, and operational clarity from day one.",
    category: "Technology",
    priceFrom: "Rs 99,999",
    delivery: "4-10 weeks",
    accent: "#38bdf8",
    proofMetric: "42%",
    proofLabel: "faster lead routing after launch",
    outcomes: ["Responsive site", "CMS-ready content", "Analytics setup", "Launch support"],
    workflow: ["Discovery", "Architecture", "Design", "Development", "QA", "Launch"],
    bookingFields: ["Business name", "Project goals", "Page count", "Feature list", "Budget range"],
    related: ["crm-development", "seo-services", "branding-design"],
    pricingTiers: [
      {
        name: "Launch Site",
        price: "Rs 99,999",
        cadence: "one-time",
        description: "A high-converting company website with launch-ready content structure.",
        features: ["Up to 8 core pages", "Responsive UI", "Lead forms", "Analytics setup"],
      },
      {
        name: "Growth Platform",
        price: "Rs 1,99,999",
        cadence: "one-time",
        description: "A stronger site with CMS-ready sections, conversion strategy, and richer UX.",
        features: ["Up to 16 pages", "CMS structure", "SEO foundations", "Performance QA"],
        highlighted: true,
      },
      {
        name: "Portal Build",
        price: "Custom",
        cadence: "project",
        description: "Client portal, dashboards, authenticated workflows, and integrations.",
        features: ["Auth workflows", "Dashboard modules", "API integrations", "Handover training"],
      },
    ],
    addons: [
      { name: "Landing page pack", price: "Rs 24,999", description: "Campaign pages for paid or organic funnels." },
      { name: "CMS migration", price: "Rs 39,999", description: "Move legacy content into the new structure." },
      { name: "Conversion sprint", price: "Rs 29,999", description: "Heatmap-led refinement after launch." },
    ],
    deliverables: ["Information architecture", "High-fidelity UI", "Production frontend", "Analytics events", "Launch checklist"],
    faqs: [
      { question: "Can the site include a client portal?", answer: "Yes. Portal builds are scoped as Growth Platform or custom Portal Build engagements." },
      { question: "Is SEO included?", answer: "Technical SEO foundations are included; ongoing SEO is available as a retainer." },
    ],
    intakeSchema: ["goals", "pages", "integrations", "content readiness", "launch date"],
    media: {
      hero: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      card: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      alt: "Modern web development workspace with laptop and analytics",
    },
    seo: {
      title: "Web Development Services for Growth Companies",
      description: "Premium web development for conversion websites, client portals, and business platforms.",
      keywords: ["web development", "company website", "client portal", "Next.js website"],
    },
  },
  {
    slug: "crm-development",
    name: "CRM Development",
    short: "Custom CRM systems, internal dashboards, and workflow automation.",
    description:
      "Operational CRM systems that centralize leads, orders, approvals, documents, payments, and reporting into one command center.",
    category: "Operations",
    priceFrom: "Rs 2,49,999",
    delivery: "6-12 weeks",
    accent: "#60a5fa",
    proofMetric: "31",
    proofLabel: "workflow checkpoints mapped before build",
    outcomes: ["Workflow mapping", "Role-based access", "Reporting layer", "Training handover"],
    workflow: ["Requirements", "Architecture", "Module planning", "Implementation", "UAT", "Deploy"],
    bookingFields: ["Team size", "Current tools", "Required modules", "Integrations", "Timeline"],
    related: ["web-development", "digital-marketing", "legal-registration"],
    pricingTiers: [
      {
        name: "CRM Core",
        price: "Rs 2,49,999",
        cadence: "project",
        description: "Lead, customer, and task workflows for small teams.",
        features: ["Lead pipeline", "User roles", "Dashboard", "Import-ready data model"],
      },
      {
        name: "Operations Hub",
        price: "Rs 4,49,999",
        cadence: "project",
        description: "Full operations system for sales, delivery, finance, and support.",
        features: ["Orders/projects", "Documents", "Invoices", "Audit trail"],
        highlighted: true,
      },
      {
        name: "Enterprise CRM",
        price: "Custom",
        cadence: "project",
        description: "Advanced RBAC, integrations, automation, and reporting.",
        features: ["Custom modules", "Advanced permissions", "Provider integrations", "SLA reports"],
      },
    ],
    addons: [
      { name: "Data migration", price: "Rs 49,999", description: "Clean and import existing leads/customers." },
      { name: "Automation pack", price: "Rs 59,999", description: "Notification and workflow automation." },
      { name: "Custom reports", price: "Rs 39,999", description: "Management dashboards and exports." },
    ],
    deliverables: ["Process map", "Database schema", "Role matrix", "Admin dashboard", "Training notes"],
    faqs: [
      { question: "Can it replace spreadsheets?", answer: "Yes. The CRM is designed to centralize spreadsheet-driven workflows into a live system." },
      { question: "Can staff have different permissions?", answer: "Yes. The launch upgrade plan expands RBAC into function-based permissions." },
    ],
    intakeSchema: ["team size", "current tools", "modules", "approval flows", "reporting needs"],
    media: {
      hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      card: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      alt: "CRM dashboard with data analytics and workflow visualization",
    },
    seo: {
      title: "Custom CRM Development Services",
      description: "Custom CRM systems, internal dashboards, and workflow automation for service businesses.",
      keywords: ["CRM development", "custom CRM", "operations dashboard", "workflow automation"],
    },
  },
  {
    slug: "seo-services",
    name: "SEO Services",
    short: "Technical SEO, content strategy, and local search growth.",
    description:
      "Search growth programs built around technical cleanup, local SEO, authority content, conversion pages, and monthly performance review.",
    category: "Growth",
    priceFrom: "Rs 19,999/month",
    delivery: "Ongoing monthly",
    accent: "#22c55e",
    proofMetric: "120",
    proofLabel: "keyword clusters planned per campaign",
    outcomes: ["SEO audit", "Keyword strategy", "Content roadmap", "Monthly reporting"],
    workflow: ["Audit", "Keyword mapping", "On-page fixes", "Content", "Reporting", "Iteration"],
    bookingFields: ["Website URL", "Target cities", "Target keywords", "CMS access", "Goals"],
    related: ["digital-marketing", "web-development", "branding-design"],
    pricingTiers: [
      {
        name: "Local SEO",
        price: "Rs 19,999",
        cadence: "monthly",
        description: "Local visibility for city/service searches.",
        features: ["GBP checklist", "Local pages", "On-page fixes", "Monthly report"],
      },
      {
        name: "Growth SEO",
        price: "Rs 39,999",
        cadence: "monthly",
        description: "Content-led SEO for stronger organic acquisition.",
        features: ["Keyword clusters", "Content briefs", "Technical cleanup", "Rank tracking"],
        highlighted: true,
      },
      {
        name: "Authority SEO",
        price: "Custom",
        cadence: "monthly",
        description: "Multi-location or competitive SEO programs.",
        features: ["Advanced reporting", "Program roadmap", "Content ops", "Conversion analysis"],
      },
    ],
    addons: [
      { name: "Technical audit", price: "Rs 14,999", description: "Standalone crawl, index, speed, and schema audit." },
      { name: "Content brief pack", price: "Rs 9,999", description: "Five SEO-ready content briefs." },
      { name: "Local landing pages", price: "Rs 19,999", description: "City/service landing page set." },
    ],
    deliverables: ["SEO audit", "Keyword map", "Content calendar", "Optimization checklist", "Monthly report"],
    faqs: [
      { question: "How soon do SEO results show?", answer: "Technical fixes can move quickly; organic growth typically compounds over 3-6 months." },
      { question: "Do you write content?", answer: "Content strategy and briefs are included; writing can be added as a content pack." },
    ],
    intakeSchema: ["website URL", "target cities", "keywords", "competitors", "CMS"],
    media: {
      hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      card: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      alt: "SEO analytics dashboard showing search performance data",
    },
    seo: {
      title: "SEO Services for Local and Growth Brands",
      description: "Technical SEO, local SEO, content strategy, and search growth reporting.",
      keywords: ["SEO services", "local SEO", "technical SEO", "content strategy"],
    },
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    short: "Performance campaigns, funnels, and creative optimization.",
    description:
      "Campaign systems for lead generation and retargeting, built with offer strategy, creative testing, tracking, and optimization loops.",
    category: "Growth",
    priceFrom: "Rs 29,999/month",
    delivery: "2-4 weeks setup",
    accent: "#f97316",
    proofMetric: "3x",
    proofLabel: "creative testing cadence for paid funnels",
    outcomes: ["Channel strategy", "Tracking plan", "Creative direction", "Performance reports"],
    workflow: ["Strategy", "Account setup", "Creative", "Launch", "Testing", "Scale"],
    bookingFields: ["Offer", "Channels", "Budget", "Target geography", "Creative assets"],
    related: ["seo-services", "branding-design", "crm-development"],
    pricingTiers: [
      {
        name: "Campaign Setup",
        price: "Rs 29,999",
        cadence: "monthly",
        description: "Launch-ready tracking, campaign structure, and creative direction.",
        features: ["Campaign architecture", "Pixel checklist", "Audience map", "Weekly optimization"],
      },
      {
        name: "Growth Retainer",
        price: "Rs 59,999",
        cadence: "monthly",
        description: "Testing engine for acquisition, retargeting, and funnel improvement.",
        features: ["Creative testing", "Landing page feedback", "Reporting", "Conversion tracking"],
        highlighted: true,
      },
      {
        name: "Scale Program",
        price: "Custom",
        cadence: "monthly",
        description: "Multi-channel growth operations for higher ad spend.",
        features: ["Multi-channel media", "Advanced dashboards", "Offer testing", "Funnel strategy"],
      },
    ],
    addons: [
      { name: "Creative pack", price: "Rs 19,999", description: "Ad creatives and campaign visuals." },
      { name: "Landing page audit", price: "Rs 9,999", description: "Conversion review for paid traffic." },
      { name: "Tracking repair", price: "Rs 14,999", description: "Pixel, event, and analytics cleanup." },
    ],
    deliverables: ["Campaign map", "Tracking plan", "Creative direction", "Report dashboard", "Optimization notes"],
    faqs: [
      { question: "Is ad spend included?", answer: "No. Management fees are separate from platform ad spend." },
      { question: "Can you manage landing pages too?", answer: "Yes. Landing page build or optimization can be bundled." },
    ],
    intakeSchema: ["offer", "target audience", "monthly spend", "channels", "creative assets"],
    media: {
      hero: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=1200&q=80",
      card: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80",
      alt: "Digital marketing strategy and campaign planning workspace",
    },
    seo: {
      title: "Digital Marketing Services",
      description: "Performance campaigns, paid funnels, tracking, and creative optimization.",
      keywords: ["digital marketing", "performance marketing", "paid ads", "lead generation"],
    },
  },
  {
    slug: "legal-registration",
    name: "Legal Registration",
    short: "Business registration, compliance assistance, and documentation support.",
    description:
      "Guided registration and compliance support with document checklists, status visibility, and organized handover.",
    category: "Compliance",
    priceFrom: "Rs 9,999",
    delivery: "1-3 weeks",
    accent: "#a78bfa",
    proofMetric: "14",
    proofLabel: "document checks before filing",
    outcomes: ["Document checklist", "Filing support", "Status visibility", "Archive handover"],
    workflow: ["Checklist", "Document review", "Portal submission", "Tracking", "Certificate handover"],
    bookingFields: ["Business type", "Founders", "Required registration", "Documents available", "Urgency"],
    related: ["branding-design", "crm-development", "web-development"],
    pricingTiers: [
      {
        name: "Starter Filing",
        price: "Rs 9,999",
        cadence: "one-time",
        description: "Basic registration support and document checklist.",
        features: ["Checklist", "Document review", "Filing support", "Status updates"],
      },
      {
        name: "Compliance Pack",
        price: "Rs 24,999",
        cadence: "one-time",
        description: "Registration plus organized compliance handover.",
        features: ["Registration support", "Compliance calendar", "Document archive", "Portal updates"],
        highlighted: true,
      },
      {
        name: "Managed Compliance",
        price: "Custom",
        cadence: "retainer",
        description: "Ongoing compliance coordination for growing businesses.",
        features: ["Recurring reminders", "Document management", "Status reporting", "Priority support"],
      },
    ],
    addons: [
      { name: "Urgent processing", price: "Custom", description: "Priority coordination where available." },
      { name: "Document organization", price: "Rs 4,999", description: "Structured archive for business documents." },
      { name: "Compliance reminders", price: "Rs 2,999/month", description: "Recurring reminders and status tracking." },
    ],
    deliverables: ["Document checklist", "Submission support", "Status tracker", "Certificate archive", "Handover note"],
    faqs: [
      { question: "Do you provide legal advice?", answer: "The service supports filing coordination and documentation; legal advice requires qualified legal review." },
      { question: "Can documents appear in the portal?", answer: "Yes. The document hub stores and exposes client documents." },
    ],
    intakeSchema: ["business type", "founders", "registration need", "documents", "urgency"],
    media: {
      hero: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
      card: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      alt: "Legal documents and registration paperwork on desk",
    },
    seo: {
      title: "Business Legal Registration Support",
      description: "Registration, filing support, document checklists, and compliance handover.",
      keywords: ["business registration", "legal registration", "compliance support"],
    },
  },
  {
    slug: "branding-design",
    name: "Branding & Design",
    short: "Identity systems, brand kits, and visual communication assets.",
    description:
      "Positioning-led identity and design systems for companies that need a sharper, more consistent market presence.",
    category: "Brand",
    priceFrom: "Rs 49,999",
    delivery: "2-6 weeks",
    accent: "#f43f5e",
    proofMetric: "28",
    proofLabel: "brand assets in a typical handover",
    outcomes: ["Brand direction", "Visual system", "Asset kit", "Handover package"],
    workflow: ["Discovery", "Moodboards", "Concepts", "Refinement", "Final files", "Asset rollout"],
    bookingFields: ["Brand stage", "Audience", "Deliverables", "Preferred style", "Deadline"],
    related: ["web-development", "digital-marketing", "seo-services"],
    pricingTiers: [
      {
        name: "Identity Starter",
        price: "Rs 49,999",
        cadence: "project",
        description: "Brand direction, identity concept, and essential assets.",
        features: ["Logo direction", "Color/type system", "Basic brand guide", "Social starter kit"],
      },
      {
        name: "Brand System",
        price: "Rs 99,999",
        cadence: "project",
        description: "Complete visual system for marketing and digital rollout.",
        features: ["Identity system", "Brand guidelines", "Presentation kit", "Marketing templates"],
        highlighted: true,
      },
      {
        name: "Launch Creative",
        price: "Custom",
        cadence: "project",
        description: "Brand system plus campaign and website creative direction.",
        features: ["Campaign visuals", "Website art direction", "Ad templates", "Launch assets"],
      },
    ],
    addons: [
      { name: "Pitch deck design", price: "Rs 24,999", description: "Investor or sales deck design system." },
      { name: "Social template pack", price: "Rs 14,999", description: "Reusable content templates." },
      { name: "Brand naming sprint", price: "Rs 19,999", description: "Naming concepts and screening support." },
    ],
    deliverables: ["Brand strategy notes", "Logo direction", "Visual system", "Template kit", "Handover package"],
    faqs: [
      { question: "Do you only design logos?", answer: "No. The focus is a usable visual system, not just one logo file." },
      { question: "Can branding connect to website design?", answer: "Yes. Branding and web development are designed to work together." },
    ],
    intakeSchema: ["brand stage", "audience", "style direction", "deliverables", "deadline"],
    media: {
      hero: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
      card: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
      alt: "Design studio with branding materials and creative tools",
    },
    seo: {
      title: "Branding and Design Services",
      description: "Identity systems, brand kits, design direction, and marketing assets.",
      keywords: ["branding", "brand design", "identity system", "brand kit"],
    },
  },
];

export const serviceMap = Object.fromEntries(services.map((service) => [service.slug, service]));
