import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, HelpCircle, PackageCheck } from "lucide-react";

import { PremiumSection, PricingTierCard, ServiceVisualCard, VisualFrame } from "@/components/premium-visuals";
import { SiteShell } from "@/components/site-shell";
import { StaggerContainer, StaggerItem, FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { CardGridSkeleton } from "@/components/skeleton-system";
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
      <div className="service-detail-page">
      <FadeIn>
        <section className="premium-hero">
          <div className="container premium-hero-grid">
            <div className="premium-hero-copy">
              <div className="breadcrumb">Home / Services / {service.name}</div>
              <p className="eyebrow">{service.category}</p>
              <h1>{service.name}</h1>
              <p className="hero-copy">{service.description}</p>
              <div className="button-row">
                <Link href={`/book?service=${service.slug}`} className="primary-button">
                  Book this service
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="ghost-button">
                  Ask a question
                </Link>
              </div>
              <div className="premium-kpi-row">
                <div className="premium-kpi">
                  <strong>{service.priceFrom}</strong>
                  <span>starting investment</span>
                </div>
                <div className="premium-kpi">
                  <strong>{service.delivery}</strong>
                  <span>delivery window</span>
                </div>
                <div className="premium-kpi">
                  <strong>{service.proofMetric}</strong>
                  <span>{service.proofLabel}</span>
                </div>
              </div>
            </div>
            <VisualFrame src={service.media.hero} alt={service.media.alt} label={`${service.name} system`} metric={service.category} />
          </div>
        </section>
      </FadeIn>

      <PremiumSection
        eyebrow="Packages"
        title={`Choose the right ${service.name.toLowerCase()} package`}
        description="Each package maps into booking, invoice, payment, delivery, and support workflows."
      >
        <SkeletonReveal skeleton={<div className="pricing-tier-grid" style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>{[1, 2, 3].map((i) => <div key={i} className="card" style={{ pointerEvents: "none", minHeight: "16rem" }} />)}</div>} delay={120}>
          <StaggerContainer className="pricing-tier-grid" staggerDelay={0.08}>
            {service.pricingTiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <PricingTierCard tier={tier} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <PremiumSection eyebrow="Deliverables" title="What the client receives">
        <SkeletonReveal skeleton={<div className="split-grid">{[1, 2].map((i) => <div key={i} className="card" style={{ pointerEvents: "none", minHeight: "12rem" }} />)}</div>} delay={120}>
          <StaggerContainer className="split-grid" staggerDelay={0.06}>
            <StaggerItem>
              <article className="card">
                <h3>Core deliverables</h3>
                <ul className="detail-list">
                  {service.deliverables.map((item) => (
                    <li key={item}>
                      <PackageCheck size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </StaggerItem>
            <StaggerItem>
              <article className="card">
                <h3>Business outcomes</h3>
                <ul className="detail-list">
                  {service.outcomes.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </StaggerItem>
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <PremiumSection eyebrow="Workflow" title="Step-by-step delivery flow">
        <SkeletonReveal skeleton={<div className="timeline">{[1, 2, 3].map((i) => <div key={i} className="timeline-step" style={{ pointerEvents: "none", minHeight: "8rem" }} />)}</div>} delay={120}>
          <StaggerContainer className="timeline" staggerDelay={0.06}>
            {service.workflow.map((item, index) => (
              <StaggerItem key={item}>
                <article className="timeline-step">
                  <span>{index + 1}</span>
                  <h3>{item}</h3>
                  <p>This phase is tracked through project, message, document, invoice, and support workflows where relevant.</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <PremiumSection eyebrow="Add-ons" title="Extend the engagement">
        <SkeletonReveal skeleton={<CardGridSkeleton count={3} />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.05}>
            {service.addons.map((addon) => (
              <StaggerItem key={addon.name}>
                <article className="card">
                  <div className="card-topline">{addon.price}</div>
                  <h3>{addon.name}</h3>
                  <p>{addon.description}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <PremiumSection eyebrow="FAQ" title="Common buying questions">
        <SkeletonReveal skeleton={<div className="split-grid">{[1, 2, 3, 4].map((i) => <div key={i} className="card" style={{ pointerEvents: "none", minHeight: "10rem" }} />)}</div>} delay={120}>
          <StaggerContainer className="split-grid" staggerDelay={0.06}>
            {service.faqs.map((faq) => (
              <StaggerItem key={faq.question}>
                <article className="card">
                  <HelpCircle size={20} />
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <PremiumSection eyebrow="Related services" title="Natural cross-sell paths">
        <SkeletonReveal skeleton={<CardGridSkeleton count={related.length || 2} />} delay={120}>
          <StaggerContainer className="service-visual-grid" staggerDelay={0.06}>
            {related.map((item) => (
              <StaggerItem key={item.slug}>
                <ServiceVisualCard service={item} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>
    </div>
    </SiteShell>
  );
}
