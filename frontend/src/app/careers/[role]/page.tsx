import { notFound } from "next/navigation";

import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { careerOpenings } from "@/lib/mock-data";

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

  return (
    <SiteShell>
      <Section eyebrow="Careers" title={job.role} description={`${job.location} • ${job.type}`}>
        <div className="split-grid">
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
          <article className="card">
            <h3>Requirements</h3>
            <ul className="detail-list">
              {job.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </Section>
    </SiteShell>
  );
}
