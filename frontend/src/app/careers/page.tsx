import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { careerOpenings } from "@/lib/mock-data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CareersPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Careers"
        title="Join the Unity Consult delivery team"
        description="We hire operators, builders, designers, and growth specialists who can turn client ambiguity into reliable execution."
      >
        <div className="card-grid">
          {careerOpenings.map((job) => (
            <article key={job.slug} className="card">
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
          ))}
        </div>
      </Section>
    </SiteShell>
  );
}
