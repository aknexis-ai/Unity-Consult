import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { blogPosts } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Blog"
        title="SEO content surface"
        description="A lean article index that maps to the PRD's content and search strategy."
      >
        <div className="card-grid">
          {blogPosts.map((post) => (
            <article key={post.slug} className="card">
              <div className="card-topline">{post.category}</div>
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
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
