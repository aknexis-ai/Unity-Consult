import Link from "next/link";
import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { SiteShell } from "@/components/site-shell";
import { serviceMap, services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceMap[slug];

  if (!service) {
    notFound();
  }

  const related = service.related
    .map((relatedSlug) => serviceMap[relatedSlug])
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <SiteShell>
      <section className="hero compact-hero">
        <div className="container stack-lg">
          <div className="breadcrumb">Home / Services / {service.name}</div>
          <p className="eyebrow">{service.category}</p>
          <h1>{service.name}</h1>
          <p className="hero-copy">{service.description}</p>
          <div className="button-row">
            <Link href="/book" className="primary-button">
              Book this service
            </Link>
            <span className="badge">{service.priceFrom}</span>
            <span className="badge">{service.delivery}</span>
          </div>
        </div>
      </section>

      <Section eyebrow="Overview" title="Why businesses buy this">
        <div className="split-grid">
          <article className="card">
            <h3>Outcomes</h3>
            <ul className="detail-list">
              {service.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h3>Booking fields</h3>
            <ul className="detail-list">
              {service.bookingFields.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      <Section eyebrow="Workflow" title="Step-by-step delivery flow">
        <div className="timeline">
          {service.workflow.map((item, index) => (
            <article key={item} className="timeline-step">
              <span>{index + 1}</span>
              <h3>{item}</h3>
              <p>Placeholder delivery note for the {item.toLowerCase()} phase.</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Related services" title="Cross-sell paths from the PRD">
        <div className="card-grid">
          {related.map((item) => (
            <ServiceCard key={item.slug} service={item} />
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
