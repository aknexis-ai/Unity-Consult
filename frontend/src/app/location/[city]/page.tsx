import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { company } from "@/lib/company";
import { locationMap, locations } from "@/lib/locations";
import { services } from "@/lib/services";

export function generateStaticParams() {
  return locations.map((location) => ({ city: location.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }) {
  const location = locationMap[params.city];

  if (!location) {
    return {};
  }

  return {
    title: `${location.city} Digital Consulting | Unity Consult`,
    description: location.description,
  };
}

export default function LocationPage({ params }: { params: { city: string } }) {
  const location = locationMap[params.city];

  if (!location) {
    notFound();
  }

  return (
    <SiteShell>
      <Section
        eyebrow={`Unity Consult ${location.city}`}
        title={location.headline}
        description={location.description}
      >
        <div className="split-grid">
          <article className="card stack">
            <h3>Local service coverage</h3>
            <p>
              A city-focused landing page for search visitors that connects public lead capture, booking,
              CRM tracking, client portal delivery, and support workflows.
            </p>
            <div className="badge-row">
              {services.map((service) => (
                <span key={service.slug} className="badge">
                  {service.name}
                </span>
              ))}
            </div>
          </article>
          <article className="card stack">
            <h3>Best-fit industries</h3>
            <ul className="detail-list">
              {location.industries.map((industry) => (
                <li key={industry}>{industry}</li>
              ))}
            </ul>
            <p>
              Talk to {company.name} at {company.email} or start with a service booking for a structured
              proposal and CRM-backed follow-up.
            </p>
          </article>
        </div>
      </Section>
    </SiteShell>
  );
}
