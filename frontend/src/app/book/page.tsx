import { BookingWizard } from "@/components/booking-wizard";
import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";

export default function BookPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Booking engine"
        title="A guided multi-step booking flow"
        description="This is the lean implementation of the PRD's service-specific intake, review, and payment handoff experience."
      >
        <BookingWizard />
      </Section>
    </SiteShell>
  );
}
