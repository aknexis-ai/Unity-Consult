import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { company } from "@/lib/company";

export default function AboutPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="About"
        title={`${company.name} builds operating systems for digital service businesses`}
        description="Unity Consult combines consulting, software delivery, brand systems, growth strategy, and legal enablement into one managed client experience."
      >
        <div className="split-grid">
          <article className="card">
            <h3>Positioning</h3>
            <p>{company.description}</p>
          </article>
          <article className="card">
            <h3>Operating principles</h3>
            <ul className="detail-list">
              <li>Every engagement has a named owner, milestone plan, and document trail.</li>
              <li>Clients get live visibility into projects, invoices, messages, and support.</li>
              <li>Internal teams manage leads, orders, content, support, and delivery from one CRM.</li>
            </ul>
          </article>
        </div>
      </Section>
    </SiteShell>
  );
}
