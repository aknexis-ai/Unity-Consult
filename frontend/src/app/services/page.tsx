import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { SiteShell } from "@/components/site-shell";
import { StaggerContainer, StaggerItem, SkeletonReveal } from "@/components/motion-primitives";
import { CardGridSkeleton } from "@/components/skeleton-system";
import { services } from "@/lib/services";

export default function ServicesPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Service catalog"
        title="Six specialised service lines to grow your business"
        description="From web presence to legal compliance — every service includes clear pricing, delivery timelines, and a structured path from enquiry to completion."
      >
        <SkeletonReveal skeleton={<CardGridSkeleton count={6} />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.06}>
            {services.map((service) => (
              <StaggerItem key={service.slug}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </Section>
    </SiteShell>
  );
}
