import { notFound } from "next/navigation";
import Image from "next/image";

import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { CompactHeroSkeleton } from "@/components/skeleton-system";
import { blogPosts } from "@/lib/mock-data";
import { services } from "@/lib/services";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    notFound();
  }

  const cover = services[blogPosts.findIndex((entry) => entry.slug === slug) % services.length];

  return (
    <SiteShell>
      <SkeletonReveal skeleton={<CompactHeroSkeleton />} delay={120}>
        <section className="hero compact-hero">
          <div className="container stack-lg">
            <FadeIn>
              <div className="breadcrumb">Home / Blog / {post.title}</div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="eyebrow">{post.category}</p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <h1>{post.title}</h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mini-meta">
                {post.author} • {post.readTime} • {post.publishedAt}
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="hero-copy">{post.excerpt}</p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="visual-frame" style={{ minHeight: "22rem" }}>
                <Image
                  src={cover.media.hero}
                  alt={`${post.title} article hero image`}
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
      </SkeletonReveal>

      <Section eyebrow="Article" title={post.title}>
        <div className="article-shell">
          {post.sections.map((section, i) => (
            <FadeIn key={section} delay={i * 0.06}>
              <p>{section}</p>
            </FadeIn>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
