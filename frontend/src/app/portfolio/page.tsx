import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { portfolioItems } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/services";
import { StaggerContainer, StaggerItem, SkeletonReveal } from "@/components/motion-primitives";
import { CardGridSkeleton } from "@/components/skeleton-system";

const CAT_COLORS: Record<string, string> = {
  "Website + CRM": "#2F9E44",
  SEO: "#FFD166",
  Branding: "#FFD166",
};

export default function PortfolioPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Portfolio"
        title="Transformation stories from our clients"
        description="Real projects, measurable outcomes. Explore how we help businesses scale with tailored digital solutions."
      >
        <SkeletonReveal skeleton={<CardGridSkeleton count={3} />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.07}>
            {portfolioItems.map((item, index) => (
              <StaggerItem key={item.title}>
                <article className="card">
                  <div style={{ position: "relative", width: "100%", height: "13rem", borderRadius: 20, overflow: "hidden", marginBottom: "0.75rem" }}>
                    <Image
                      src={services[(index + 1) % services.length].media.card}
                      alt={`${item.title} case study cover image`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-topline" style={{ color: CAT_COLORS[item.category] ?? "var(--accent)" }}>{item.category}</div>
                  <h3>{item.title}</h3>
                  <p className="mini-meta">
                    {item.client} • {item.year}
                  </p>
                  <p>{item.summary}</p>
                  <p>{item.result}</p>
                  <Link href={`/portfolio/${item.slug}`} className="inline-link">
                    Read case study
                    <ArrowRight size={16} />
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </Section>
    </SiteShell>
  );
}
