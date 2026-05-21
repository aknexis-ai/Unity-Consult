import { SiteShell } from "@/components/site-shell";
import { Section } from "@/components/section";
import { services } from "@/lib/services";

export default function PricingPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Pricing"
        title="Transparent starting prices for every service line"
        description="Each package is structured around scoped deliverables, milestone visibility, invoicing, and payment tracking through the client portal."
      >
        <div className="card-grid">
          {services.map((service) => (
            <article key={service.slug} className="card">
              <div className="card-topline">{service.category}</div>
              <h3>{service.name}</h3>
              <p>{service.short}</p>
              <div className="price-block">{service.priceFrom}</div>
              <p>Delivery: {service.delivery}</p>
            </article>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
