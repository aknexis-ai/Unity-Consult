import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { SiteShell } from "@/components/site-shell";
import { services } from "@/lib/services";

export default function ServicesPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Service catalog"
        title="All six PRD service categories in one structured catalog"
        description="This page mirrors the public catalog surface with consistent pricing, delivery, and exploration entry points."
      >
        <div className="card-grid">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
