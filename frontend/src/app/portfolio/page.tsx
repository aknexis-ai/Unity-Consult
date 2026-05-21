import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { portfolioItems } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PortfolioPage() {
  return (
    <SiteShell>
      <Section eyebrow="Portfolio" title="Selected transformation case studies">
        <div className="card-grid">
          {portfolioItems.map((item) => (
            <article key={item.title} className="card">
              <div className="card-topline">{item.category}</div>
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
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
