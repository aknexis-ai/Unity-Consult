import Image from "next/image";
import { ArrowRight, Building2, Globe, Layers, Users } from "lucide-react";

import { PremiumSection, ProofStrip, VisualFrame } from "@/components/premium-visuals";
import { SiteShell } from "@/components/site-shell";
import { FadeIn, SkeletonReveal, StaggerContainer, StaggerItem } from "@/components/motion-primitives";
import { CardGridSkeleton, CompactHeroSkeleton } from "@/components/skeleton-system";
import { company } from "@/lib/company";
import { ScrambleText } from "@/components/motion/framer-fx";

const values = [
  {
    title: "Client ownership",
    description: "Every engagement has a named owner, milestone plan, and document trail from day one.",
    image: "/images/services/web-development.svg",
  },
  {
    title: "Radical transparency",
    description: "Clients get live visibility into projects, invoices, messages, and support through their portal.",
    image: "/images/services/crm-development.svg",
  },
  {
    title: "Operational rigour",
    description: "Internal teams manage leads, orders, content, support, and delivery from one unified CRM.",
    image: "/images/brand/command-center.svg",
  },
  {
    title: "Outcome alignment",
    description: "Every deliverable ties back to a measurable business outcome, not just a task list.",
    image: "/images/services/seo-services.svg",
  },
];

const stats = [
  { icon: <Building2 size={20} />, value: "120+", label: "Clients served across industries" },
  { icon: <Globe size={20} />, value: "250+", label: "Projects delivered globally" },
  { icon: <Users size={20} />, value: company.socialProof.rating, label: "Client satisfaction rating" },
  { icon: <Layers size={20} />, value: "8+", label: "Countries with active engagements" },
];

const proofItems = [
  "250+ projects delivered across technology, growth, brand, and compliance",
  "120+ businesses trust Unity Consult for operations and delivery",
  "4.9/5 average client satisfaction rating",
  "8+ country presence with remote and on-site delivery",
  "End-to-end portal visibility for every engagement",
];

export default function AboutPage() {
  return (
    <SiteShell>
      <SkeletonReveal skeleton={<CompactHeroSkeleton />} delay={120}>
        <section className="section glass">
          <div className="container stack-lg" style={{ textAlign: "center" }}>
            <FadeIn>
              <p className="eyebrow">About Unity Consult</p>
              <h1 className="au-h1" style={{ color: "var(--text)", letterSpacing: "-0.05em" }}>
                <ScrambleText as="span" text="Your strategic partner for digital growth and operational excellence" trigger="view" />
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="hero-copy" style={{ maxWidth: "72ch", margin: "0 auto 2rem" }}>
                At Unity Consult, we combine consulting, technology delivery, brand strategy, growth execution, and compliance enablement into one seamless client experience.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <VisualFrame
                src="/images/hero-about.webp"
                alt="Unity Consult team collaboration and operations workspace"
                label="Operations command centre"
                metric="Since 2020"
              />
            </FadeIn>
          </div>
        </section>
      </SkeletonReveal>

      <ProofStrip items={proofItems} />

      <PremiumSection
        eyebrow="Our values"
        title="Built around transparency, ownership, and measurable outcomes"
        description="Four operating principles define how every engagement is structured, delivered, and reviewed."
      >
        <SkeletonReveal skeleton={<CardGridSkeleton count={4} />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.06}>
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <article className="card" style={{ textAlign: "center", overflow: "hidden" }}>
                  <div className="visual-frame" style={{ minHeight: "10rem", marginBottom: "1rem", borderRadius: "16px" }}>
                    <Image src={value.image} alt={value.title} fill sizes="(max-width: 720px) 100vw, 280px" style={{ objectFit: "cover" }} unoptimized />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <PremiumSection
        eyebrow="By the numbers"
        title="Trust built through consistent delivery"
        description="Real metrics from active engagements across technology, growth, brand, and compliance service lines."
      >
        <SkeletonReveal skeleton={<CardGridSkeleton count={4} />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.06}>
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <article className="card" style={{ textAlign: "center" }}>
                  <div className="card-topline">{stat.icon} {stat.value}</div>
                  <p>{stat.label}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <PremiumSection
        eyebrow="How we work"
        title="One platform. One portal. Full visibility."
        description="Every client engagement is structured through the same operating system — from first booking to final handover and beyond."
      >
        <SkeletonReveal skeleton={<div className="split-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>{[1, 2, 3, 4].map((i) => <div key={i} className="card" style={{ pointerEvents: "none", minHeight: "10rem" }} />)}</div>} delay={120}>
          <StaggerContainer className="split-grid" staggerDelay={0.06}>
            {[
              { step: "01", title: "Booking and scoping", description: "Clients book through the public wizard. Our team reviews requirements, generates an invoice, and sets up the project workspace.", image: "/images/services/web-development.svg" },
              { step: "02", title: "Execution and tracking", description: "Workflows, deliverables, and milestones are tracked live. Clients monitor progress through their portal dashboard.", image: "/images/services/crm-development.svg" },
              { step: "03", title: "Review and delivery", description: "Each milestone moves through review cycles. Documents, invoices, and messages are consolidated in one place.", image: "/images/services/legal-registration.svg" },
              { step: "04", title: "Support and retention", description: "Post-delivery, clients access ongoing support, retainer billing, and additional services through the same portal.", image: "/images/brand/command-center.svg" },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <article className="card" style={{ overflow: "hidden" }}>
                  <div className="visual-frame" style={{ minHeight: "10rem", marginBottom: "1rem", borderRadius: "16px" }}>
                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 720px) 100vw, 360px" style={{ objectFit: "cover" }} unoptimized />
                  </div>
                  <span className="card-topline">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      <FadeIn>
        <section className="section glass">
          <div className="container" style={{ textAlign: "center" }}>
            <div className="final-cta">
              <div>
                <p className="eyebrow">Start your engagement</p>
                <h2>Ready to work with a team that treats your business like their own?</h2>
              </div>
              <a href="/book" className="primary-button">
                Book a service
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </FadeIn>
    </SiteShell>
  );
}
