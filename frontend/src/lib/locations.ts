export type LocationLanding = {
  city: string;
  slug: string;
  headline: string;
  description: string;
  industries: string[];
};

export const locations: LocationLanding[] = [
  {
    city: "Bangalore",
    slug: "bangalore",
    headline: "Digital consulting, web development, SEO, and CRM delivery in Bangalore",
    description:
      "Unity Consult supports Bangalore startups, service companies, and growth teams with PRD-aligned websites, CRM systems, local SEO, branding, digital marketing, and legal registration workflows.",
    industries: ["SaaS startups", "Consulting firms", "Local service brands", "D2C teams"],
  },
  {
    city: "Mumbai",
    slug: "mumbai",
    headline: "Premium digital growth systems for Mumbai businesses",
    description:
      "From lead-generating websites to operational CRM dashboards, Unity Consult helps Mumbai teams convert enquiries, track service delivery, and manage client communication in one ecosystem.",
    industries: ["Finance services", "Agencies", "Retail brands", "Professional services"],
  },
  {
    city: "Delhi NCR",
    slug: "delhi-ncr",
    headline: "Business registration, websites, CRM, and SEO for Delhi NCR teams",
    description:
      "Unity Consult combines compliance-ready onboarding, web execution, CRM automation, and search visibility for Delhi NCR companies that need structured digital operations.",
    industries: ["Legal and compliance", "Education", "Real estate", "B2B services"],
  },
  {
    city: "Hyderabad",
    slug: "hyderabad",
    headline: "Web, CRM, and growth consulting for Hyderabad technology companies",
    description:
      "Hyderabad teams can use Unity Consult for website launches, CRM workflows, SEO programs, and digital marketing systems connected to live booking and client portal operations.",
    industries: ["Technology services", "Healthcare", "Training companies", "Cloud teams"],
  },
];

export const locationMap = Object.fromEntries(locations.map((location) => [location.slug, location]));
