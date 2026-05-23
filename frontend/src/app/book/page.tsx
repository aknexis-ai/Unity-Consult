import { BookingWizard } from "@/components/booking-wizard";
import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { FadeIn } from "@/components/motion-primitives";
import { SkeletonReveal } from "@/components/motion-primitives";
import { CompactHeroSkeleton, FormSkeleton } from "@/components/skeleton-system";

export default function BookPage() {
  return (
    <SiteShell>
      <Section
        eyebrow="Booking engine"
        title="Start your project with a structured consultation"
        description="Select your service, share your requirements, and receive a tailored proposal with clear pricing and delivery timelines."
      >
        <SkeletonReveal
          skeleton={
            <div>
              <CompactHeroSkeleton />
              <FormSkeleton fields={4} />
            </div>
          }
          delay={120}
        >
          <FadeIn>
            <BookingWizard />
          </FadeIn>
        </SkeletonReveal>
      </Section>
    </SiteShell>
  );
}
