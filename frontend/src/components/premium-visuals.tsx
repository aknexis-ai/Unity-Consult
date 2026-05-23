import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, BadgeCheck, CheckCircle2, Sparkles } from "lucide-react";

import type { Service } from "@/lib/services";

export function VisualFrame({
  src,
  alt,
  label,
  metric,
}: {
  src: string;
  alt: string;
  label: string;
  metric?: string;
}) {
  return (
    <div className="visual-frame">
      <div className="visual-frame-glow" />
      <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 1200px" priority fetchPriority="high" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkYPj/n4EBCxg5GRhgpkATYGT4DwWYGBgBABYlBv6P1+NYAAAAAElFTkSuQmCC" className="visual-frame-image" />
      <div className="visual-frame-badge">
        <Sparkles size={16} />
        <span>{label}</span>
      </div>
      {metric ? <strong className="visual-frame-metric">{metric}</strong> : null}
    </div>
  );
}

export function ProofStrip({ items }: { items: string[] }) {
  return (
    <div className="trust-band">
      <div className="proof-strip">
        {[...items, ...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>
            <BadgeCheck size={16} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PremiumSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="premium-section">
      <div className="container stack-lg">
        <div className="premium-section-heading section-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {description ? <p className="section-description">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function ServiceVisualCard({ service }: { service: Service }) {
  return (
    <article className="service-visual-card" style={{ "--service-accent": service.accent } as CSSProperties}>
      <div className="service-card-media">
        <Image src={service.media.card} alt={service.media.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: "cover" }} />
      </div>
      <div className="service-card-body">
        <div className="card-topline">{service.category}</div>
        <h3>{service.name}</h3>
        <p>{service.short}</p>
        <div className="service-card-proof">
          <strong>{service.proofMetric}</strong>
          <span>{service.proofLabel}</span>
        </div>
        <a href={`/services/${service.slug}`} className="inline-link">
          Explore service
          <ArrowRight size={16} />
        </a>
      </div>
    </article>
  );
}

export function PricingTierCard({
  tier,
}: {
  tier: Service["pricingTiers"][number];
}) {
  return (
    <article className={`pricing-tier-card ${tier.highlighted ? "popular" : ""}`}>
      {tier.highlighted ? <span className="popular-pill">Most selected</span> : null}
      <h3>{tier.name}</h3>
      <p>{tier.description}</p>
      <div className="tier-price">
        <strong>{tier.price}</strong>
        <span>{tier.cadence}</span>
      </div>
      <ul className="detail-list">
        {tier.features.map((feature) => (
          <li key={feature}>
            <CheckCircle2 size={16} />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
