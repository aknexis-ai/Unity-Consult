import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { DetailPageSkeleton } from "@/components/skeleton-system";
import { portfolioItems } from "@/lib/mock-data";
import { services } from "@/lib/services";

export function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = portfolioItems.find((entry) => entry.slug === slug);

  if (!item) {
    notFound();
  }

  const cover = services[portfolioItems.findIndex((entry) => entry.slug === slug) % services.length];

  return (
    <SiteShell>
      <SkeletonReveal skeleton={<DetailPageSkeleton />} delay={120}>
        <section className="hero compact-hero">
          <div className="container stack-lg">
            <FadeIn>
              <div className="breadcrumb">Home / Portfolio / {item.title}</div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="eyebrow">{item.category}</p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h1>{item.title}</h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="hero-copy">{item.summary}</p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <div className="button-row">
                <span className="badge">{item.client}</span>
                <span className="badge">{item.year}</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="visual-frame" style={{ minHeight: "24rem" }}>
                <Image
                  src={cover.media.hero}
                  alt={`${item.title} case study hero image`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="visual-frame-image"
                  priority
                  fetchPriority="high"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkYPj/n4EBCxg5GRhgpkATYGT4DwWYGBgBABYlBv6P1+NYAAAAAElFTkSuQmCC"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        <Section eyebrow="Outcome" title="Commercial result">
          <div className="split-grid">
            <FadeIn>
              <article className="card">
                <h3>Project summary</h3>
                <p>{item.result}</p>
              </article>
            </FadeIn>
            <FadeIn delay={0.1}>
              <article className="card">
                <h3>Highlights</h3>
                <ul className="detail-list">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </article>
            </FadeIn>
          </div>
        </Section>

        <FadeIn delay={0.15}>
          <Section eyebrow="Next step" title="Explore related service paths">
            <div className="button-row">
              <Link href="/services" className="primary-button">
                Explore services
              </Link>
              <Link href="/book" className="ghost-button">
                Book a consultation
              </Link>
            </div>
          </Section>
        </FadeIn>
      </SkeletonReveal>
    </SiteShell>
  );
}
