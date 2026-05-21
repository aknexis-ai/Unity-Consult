import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { blogPosts } from "@/lib/mock-data";

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

  return (
    <SiteShell>
      <section className="hero compact-hero">
        <div className="container stack-lg">
          <div className="breadcrumb">Home / Blog / {post.title}</div>
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="mini-meta">
            {post.author} • {post.readTime} • {post.publishedAt}
          </p>
          <p className="hero-copy">{post.excerpt}</p>
        </div>
      </section>

      <Section eyebrow="Article" title="Editorial structure ready for real publishing">
        <div className="article-shell">
          {post.sections.map((section) => (
            <p key={section}>{section}</p>
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
