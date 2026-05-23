import dynamic from "next/dynamic";
import Image from "next/image";
import { PremiumSection, ProofStrip } from "@/components/premium-visuals";
import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal } from "@/components/motion-primitives";
import { CompactHeroSkeleton } from "@/components/skeleton-system";

const ContactFormSection = dynamic(() => import("@/components/contact-form-section").then((m) => m.ContactFormSection), {
  ssr: true,
});

export default function ContactPage() {
  return (
    <SiteShell>
      <SkeletonReveal skeleton={<CompactHeroSkeleton />} delay={120}>
        <PremiumSection
          eyebrow="Contact Unity Consult"
          title="Start a project, request support, or talk to operations."
          description="Get in touch with our team for project enquiries, support requests, or general questions. We typically respond within 24 hours."
        >
          <FadeIn>
            <ProofStrip
              items={[
                "24h response SLA",
                "Email / WhatsApp / call support",
                "CRM-backed lead routing",
              ]}
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div
              className="visual-frame"
              style={{ minHeight: "22rem" }}
            >
              <Image
                src="/images/hero-contact.webp"
                alt="Unity Consult support and operations workspace"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="visual-frame-image"
                priority
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkYPj/n4EBCxg5GRhgpkATYGT4DwWYGBgBABYlBv6P1+NYAAAAAElFTkSuQmCC"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <ContactFormSection />
          </FadeIn>
        </PremiumSection>
      </SkeletonReveal>
    </SiteShell>
  );
}
