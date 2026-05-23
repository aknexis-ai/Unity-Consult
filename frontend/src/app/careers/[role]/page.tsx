import Image from "next/image";
import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { DetailPageSkeleton } from "@/components/skeleton-system";
import { careerOpenings } from "@/lib/mock-data";
import { services } from "@/lib/services";

export function generateStaticParams() {
  return careerOpenings.map((job) => ({ role: job.slug }));
}

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const job = careerOpenings.find((entry) => entry.slug === role);

  if (!job) {
    notFound();
  }

  const visual = services[careerOpenings.findIndex((entry) => entry.slug === role) % services.length];

  return (
    <SiteShell>
      <SkeletonReveal skeleton={<DetailPageSkeleton />} delay={120}>
        <Section eyebrow="Careers" title={job.role} description={`${job.location} / ${job.type}`}>
          <FadeIn>
            <div className="visual-frame" style={{ minHeight: "22rem", marginBottom: "1.5rem" }}>
              <Image
                src={visual.media.hero}
                alt={`${job.role} role workspace image`}
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
          <div className="split-grid">
            <FadeIn>
              <article className="card">
                <h3>Role summary</h3>
                <p>{job.summary}</p>
                <h4>Responsibilities</h4>
                <ul className="detail-list">
                  {job.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </FadeIn>
            <FadeIn delay={0.1}>
              <article className="card">
                <h3>Requirements</h3>
                <ul className="detail-list">
                  {job.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </FadeIn>
          </div>
        </Section>
      </SkeletonReveal>
    </SiteShell>
  );
}
