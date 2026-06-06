import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { blogPosts } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/services";
import { StaggerContainer, StaggerItem, SkeletonReveal } from "@/components/motion-primitives";
import { CardGridSkeleton } from "@/components/skeleton-system";

const CAT_COLORS: Record<string, string> = {
  "Website Strategy": "#2F9E44",
  Operations: "#48CAE4",
  SEO: "#FFD166",
};

export default function BlogPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Blog"
        title="Insights, strategies, and industry perspectives"
        description="Expert articles on web development, digital marketing, SEO, business growth, and technology trends."
      >
        <SkeletonReveal skeleton={<CardGridSkeleton count={3} />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.06}>
            {blogPosts.map((post, index) => (
              <StaggerItem key={post.slug}>
                <article className="card">
                  <div style={{ position: "relative", width: "100%", height: "12rem", borderRadius: 20, overflow: "hidden", marginBottom: "0.75rem" }}>
                    <Image
                      src={services[index % services.length].media.card}
                      alt={`${post.title} editorial cover image`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-topline" style={{ color: CAT_COLORS[post.category] ?? "var(--accent)" }}>{post.category}</div>
                  <h3>{post.title}</h3>
                  <p className="mini-meta">
                    {post.author} • {post.readTime}
                  </p>
                  <p>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="inline-link">
                    Read article
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
