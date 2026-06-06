import Image from "next/image";
import Link from "next/link";
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
          <h2 className="au-rise">{title}</h2>
          {description ? <p className="section-description">{description}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function ServiceVisualCard({ service }: { service: Service }) {
  return (
    <article className="service-visual-card service-card-reveal" style={{ "--service-accent": service.accent } as CSSProperties}>
      <div className="service-card-media">
        <Image src={service.media.card} alt={service.media.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw" style={{ objectFit: "cover" }} />
        <div className="service-card-shutter" aria-hidden>
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} style={{ transitionDelay: `${index * 35}ms` }} />
          ))}
        </div>
        <div className="service-card-reveal-panel">
          <strong>{service.proofMetric}</strong>
          <span>{service.proofLabel}</span>
        </div>
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

const TIER_COLORS = [
  { light: "#2F9E44", dark: "#48CAE4" },
  { light: "#48CAE4", dark: "#E8FFF4" },
  { light: "#8E7BFF", dark: "#C8B6FF" },
  { light: "#FFD166", dark: "#FFD166" },
  { light: "#C8B6FF", dark: "#C8B6FF" },
  { light: "#262121", dark: "#c4ddca" },
];

export function PricingTierCard({
  tier,
  rank = 0,
  showRecommended = tier.highlighted ?? false,
  href,
}: {
  tier: Service["pricingTiers"][number];
  rank?: number;
  showRecommended?: boolean;
  href?: string;
}) {
  const c = TIER_COLORS[rank % TIER_COLORS.length];
  const card = (
    <article
      className={`pricing-tier-card ${showRecommended ? "popular" : ""} ${href ? "pricing-tier-card--clickable" : ""}`}
      style={{ ["--tier-light" as string]: c.light, ["--tier-dark" as string]: c.dark } as CSSProperties}
    >
      {showRecommended ? (
        <span className="popular-pill"><Sparkles size={13} /> Recommended</span>
      ) : null}
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
      {href ? (
        <span className="pricing-tier-action">
          Select package
          <ArrowRight size={16} />
        </span>
      ) : null}
    </article>
  );

  return href ? (
    <Link href={href} className="pricing-tier-link" aria-label={`Select ${tier.name}`}>
      {card}
    </Link>
  ) : card;
}
