import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Unity Consult collects, uses, protects, and retains platform data."
      >
        <div className="article-shell">
          <p>Unity Consult collects contact details, account information, service requirements, billing records, support messages, and project documents to deliver consulting and digital services.</p>
          <p>We use this data to manage leads, authenticate users, process orders and invoices, provide client portal access, send operational notifications, and improve service quality.</p>
          <p>Access is restricted by role-based permissions. Sensitive provider credentials are stored outside the client application and supplied through server-side environment variables.</p>
          <p>Clients may request correction, export, or deletion of eligible personal data by contacting the support team through the portal or official support email.</p>
        </div>
      </Section>
    </SiteShell>
  );
}
