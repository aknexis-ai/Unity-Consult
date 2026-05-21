export type Service = {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: string;
  priceFrom: string;
  delivery: string;
  outcomes: string[];
  workflow: string[];
  bookingFields: string[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "web-development",
    name: "Web Development",
    short: "Conversion-focused company websites, portals, and business platforms.",
    description:
      "Modern websites and web apps built for trust, speed, and measurable business outcomes.",
    category: "Technology",
    priceFrom: "₹99,999",
    delivery: "4-10 weeks",
    outcomes: ["Responsive site", "CMS-ready content", "Analytics setup", "Launch support"],
    workflow: ["Discovery", "Architecture", "Design", "Development", "QA", "Launch"],
    bookingFields: ["Business name", "Project goals", "Page count", "Feature list", "Budget range"],
    related: ["crm-development", "seo-services", "branding-design"],
  },
  {
    slug: "crm-development",
    name: "CRM Development",
    short: "Custom CRM systems, internal dashboards, and workflow automation.",
    description:
      "Internal systems that centralize lead flow, service delivery, approvals, and reporting.",
    category: "Operations",
    priceFrom: "₹2,49,999",
    delivery: "6-12 weeks",
    outcomes: ["Workflow mapping", "Role-based access", "Reporting layer", "Training handover"],
    workflow: ["Requirements", "Architecture", "Module planning", "Implementation", "UAT", "Deploy"],
    bookingFields: ["Team size", "Current tools", "Required modules", "Integrations", "Timeline"],
    related: ["web-development", "digital-marketing", "legal-registration"],
  },
  {
    slug: "seo-services",
    name: "SEO Services",
    short: "Technical SEO, content strategy, and local search growth.",
    description:
      "Search visibility programs built on audits, content planning, on-page cleanup, and reporting.",
    category: "Growth",
    priceFrom: "₹19,999/month",
    delivery: "Ongoing monthly",
    outcomes: ["SEO audit", "Keyword strategy", "Content roadmap", "Monthly reporting"],
    workflow: ["Audit", "Keyword mapping", "On-page fixes", "Content", "Reporting", "Iteration"],
    bookingFields: ["Website URL", "Target cities", "Target keywords", "CMS access", "Goals"],
    related: ["digital-marketing", "web-development", "branding-design"],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    short: "Performance campaigns, funnels, and creative optimization.",
    description:
      "Campaign strategy across paid channels with testing, creative iterations, and conversion tracking.",
    category: "Growth",
    priceFrom: "₹29,999/month",
    delivery: "2-4 weeks setup",
    outcomes: ["Channel strategy", "Tracking plan", "Creative direction", "Performance reports"],
    workflow: ["Strategy", "Account setup", "Creative", "Launch", "Testing", "Scale"],
    bookingFields: ["Offer", "Channels", "Budget", "Target geography", "Creative assets"],
    related: ["seo-services", "branding-design", "crm-development"],
  },
  {
    slug: "legal-registration",
    name: "Legal Registration",
    short: "Business registration, compliance assistance, and documentation support.",
    description:
      "Structured support for entity setup, registration paperwork, and compliance-ready submissions.",
    category: "Compliance",
    priceFrom: "₹9,999",
    delivery: "1-3 weeks",
    outcomes: ["Document checklist", "Filing support", "Status visibility", "Archive handover"],
    workflow: ["Checklist", "Document review", "Portal submission", "Tracking", "Certificate handover"],
    bookingFields: ["Business type", "Founders", "Required registration", "Documents available", "Urgency"],
    related: ["branding-design", "crm-development", "web-development"],
  },
  {
    slug: "branding-design",
    name: "Branding & Design",
    short: "Identity systems, brand kits, and visual communication assets.",
    description:
      "Positioning-led design systems covering logo direction, visual language, and rollout assets.",
    category: "Brand",
    priceFrom: "₹49,999",
    delivery: "2-6 weeks",
    outcomes: ["Brand direction", "Visual system", "Asset kit", "Handover package"],
    workflow: ["Discovery", "Moodboards", "Concepts", "Refinement", "Final files", "Asset rollout"],
    bookingFields: ["Brand stage", "Audience", "Deliverables", "Preferred style", "Deadline"],
    related: ["web-development", "digital-marketing", "seo-services"],
  },
];

export const serviceMap = Object.fromEntries(services.map((service) => [service.slug, service]));
