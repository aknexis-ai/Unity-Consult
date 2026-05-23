"use client";

import { FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { SectionHeadingSkeleton } from "@/components/skeleton-system";
import { company } from "@/lib/company";

export function AboutContentSection() {
  return (
    <SkeletonReveal skeleton={<SectionHeadingSkeleton />} delay={120}>
      <div className="split-grid">
        <FadeIn>
          <article className="card">
            <h3>Positioning</h3>
            <p>{company.description}</p>
          </article>
        </FadeIn>
        <FadeIn delay={0.1}>
          <article className="card">
            <h3>Operating principles</h3>
            <ul className="detail-list">
              <li>Every engagement has a named owner, milestone plan, and document trail.</li>
              <li>Clients get live visibility into projects, invoices, messages, and support.</li>
              <li>Internal teams manage leads, orders, content, support, and delivery from one CRM.</li>
            </ul>
          </article>
        </FadeIn>
      </div>
    </SkeletonReveal>
  );
}
