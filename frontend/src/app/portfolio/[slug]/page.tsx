import Link from "next/link";
import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { portfolioItems } from "@/lib/mock-data";

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

  return (
    <SiteShell>
      <section className="hero compact-hero">
        <div className="container stack-lg">
          <div className="breadcrumb">Home / Portfolio / {item.title}</div>
          <p className="eyebrow">{item.category}</p>
          <h1>{item.title}</h1>
          <p className="hero-copy">{item.summary}</p>
          <div className="button-row">
            <span className="badge">{item.client}</span>
            <span className="badge">{item.year}</span>
          </div>
        </div>
      </section>

      <Section eyebrow="Outcome" title="Commercial result">
        <div className="split-grid">
          <article className="card">
            <h3>Project summary</h3>
            <p>{item.result}</p>
          </article>
          <article className="card">
            <h3>Highlights</h3>
            <ul className="detail-list">
              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

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
    </SiteShell>
  );
}
