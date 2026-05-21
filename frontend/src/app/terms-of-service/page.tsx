import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";

export default function TermsOfServicePage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Legal"
        title="Terms of Service"
        description="Commercial terms for using Unity Consult services, portal access, and managed delivery workflows."
      >
        <div className="article-shell">
          <p>By submitting an enquiry, creating an account, booking a service, or using the client portal, you agree to provide accurate information and cooperate with required onboarding steps.</p>
          <p>Service scope, pricing, delivery milestones, payment schedules, and revision limits are confirmed through orders, proposals, invoices, or written project communication.</p>
          <p>Portal access is provided for project visibility, documents, messages, invoices, payments, and support. Users are responsible for protecting account credentials and reporting unauthorized access.</p>
          <p>Unity Consult may pause delivery for unpaid invoices, missing approvals, unavailable client inputs, or activity that compromises platform security or service integrity.</p>
        </div>
      </Section>
    </SiteShell>
  );
}
