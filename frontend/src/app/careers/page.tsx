import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { careerOpenings } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/services";
import { StaggerContainer, StaggerItem, SkeletonReveal } from "@/components/motion-primitives";
import { CardGridSkeleton } from "@/components/skeleton-system";

export default function CareersPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Careers"
        title="Join the Unity Consult delivery team"
        description="We hire operators, builders, designers, and growth specialists who can turn client ambiguity into reliable execution."
      >
        <SkeletonReveal skeleton={<CardGridSkeleton count={3} />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.07}>
            {careerOpenings.map((job, index) => (
              <StaggerItem key={job.slug}>
                <article className="card">
                  <div style={{ position: "relative", width: "100%", height: "11rem", borderRadius: 20, overflow: "hidden", marginBottom: "0.75rem" }}>
                    <Image
                      src={services[(index + 3) % services.length].media.card}
                      alt={`${job.role} team role visual`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <h3>{job.role}</h3>
                  <p className="mini-meta">
                    {job.location} • {job.type}
                  </p>
                  <p>{job.summary}</p>
                  <Link href={`/careers/${job.slug}`} className="inline-link">
                    View role
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
