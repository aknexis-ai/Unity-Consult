import Link from "next/link";
import { ArrowRight, BadgePercent, CreditCard, ShieldCheck, Sparkles } from "lucide-react";

import { PremiumSection, ProofStrip } from "@/components/premium-visuals";
import { PricingInteractive } from "@/components/pricing-interactive";
import { SiteShell } from "@/components/site-shell";
import { FadeIn, StaggerContainer, StaggerItem, SkeletonReveal } from "@/components/motion-primitives";
import { CardGridSkeleton, PricingGridSkeleton } from "@/components/skeleton-system";
import { services } from "@/lib/services";

const pricingProof = [
  "Advance, full, milestone, and retainer payment options",
  "Client portal invoice visibility and payment tracking",
  "Secure payment processing with integrated billing",
  "Transparent refund management and full audit trail",
  "Service-specific packages for every budget",
];

export default function PricingPage() {
  return (
    <SiteShell>
      <FadeIn>
        <section className="premium-hero">
          <div className="container premium-hero-grid">
            <div className="premium-hero-copy">
              <p className="eyebrow">Pricing and payment</p>
              <h1>Transparent pricing built for serious partnerships.</h1>
              <p className="hero-copy">
                Compare packages, payment options, and add-ons designed for businesses that value clarity and predictable delivery.
              </p>
              <div className="button-row">
                <Link href="/book" className="primary-button">
                  Choose a plan
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="ghost-button">
                  Request custom quote
                </Link>
              </div>
            </div>
            <FadeIn delay={0.15}>
              <div className="card stack-lg">
                <Sparkles size={24} />
                <h2>Flexible payment options for every engagement</h2>
                <div className="feature-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                  {["Full payment", "Advance payment", "Milestone billing", "Recurring retainers"].map((item) => (
                    <div key={item} className="stat-pill">
                      <CreditCard size={16} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </FadeIn>

      <ProofStrip items={pricingProof} />

      <PremiumSection
        eyebrow="Popular packages"
        title="Popular packages with flexible billing controls"
        description="Compare plans across all service lines and choose the payment option that fits your cash flow."
      >
        <FadeIn>
          <PricingInteractive services={services} />
        </FadeIn>
      </PremiumSection>

      <PremiumSection
        eyebrow="All service starting points"
        title="Every service starts with a clear investment range"
        description="Starting prices, delivery timelines, and popular add-ons for each service category."
      >
        <SkeletonReveal skeleton={<PricingGridSkeleton />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.06}>
            {services.map((service) => (
              <StaggerItem key={service.slug}>
                <article className="card pricing-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div className="card-topline">{service.category}</div>
                  <h3>{service.name}</h3>
                  <p>{service.short}</p>
                  <div className="price-block">{service.priceFrom}</div>
                  <p>Delivery: {service.delivery}</p>
                  <ul className="detail-list" style={{ flex: 1 }}>
                    {service.addons.slice(0, 2).map((addon) => (
                      <li key={addon.name}>
                        <BadgePercent size={16} />
                        {addon.name}: {addon.price}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${service.slug}`} className="inline-link">
                    View package details
                    <ArrowRight size={16} />
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <FadeIn>
        <section className="section">
          <div className="container">
            <div className="final-cta">
              <div>
                <p className="eyebrow">Buyer confidence</p>
                <h2>Every package connects to portal delivery, invoicing, and payment visibility.</h2>
              </div>
              <div className="stat-pill">
                <ShieldCheck size={16} />
                Secure payments and full delivery protection included
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </SiteShell>
  );
}
