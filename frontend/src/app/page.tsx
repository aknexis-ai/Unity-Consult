
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const testimonialAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
];

import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedCounter, FadeIn, StaggerContainer, StaggerItem, SkeletonReveal } from "@/components/motion-primitives";
import {
  HeroSkeleton,
  MetricsGridSkeleton,
  EditorialBlockSkeleton,
  CaseStudyGridSkeleton,
  TestimonialGridSkeleton,
  TimelineSkeleton,
  CardGridSkeleton,
  SectionHeadingSkeleton,
} from "@/components/skeleton-system";
import { PremiumSection, ProofStrip } from "@/components/premium-visuals";
import { SiteShell } from "@/components/site-shell";
import { company } from "@/lib/company";
import { blogPosts, portfolioItems, testimonials, trustSignals } from "@/lib/mock-data";
import { services } from "@/lib/services";

const serviceImages = services.map((s) => s.media.card);

// ─── Static Data ──────────────────────────────────────────────

const operatingSystem = [
  {
    icon: BriefcaseBusiness,
    title: "Lead-to-project engine",
    description: "Booking, CRM, orders, project creation, invoicing, and payment readiness are connected in one journey.",
  },
  {
    icon: LayoutDashboard,
    title: "Client delivery portal",
    description: "Clients get projects, files, invoices, payments, messages, and support without scattered follow-ups.",
  },
  {
    icon: BarChart3,
    title: "Admin command center",
    description: "Staff manage pipeline, service catalog, content, finance, tickets, audit, and operational metrics.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade infrastructure",
    description: "Secure authentication, role-based access, payment processing, email, messaging, and a managed database.",
  },
];

function useParallax(value: number) {
  const { scrollY } = useScroll();
  return useTransform(scrollY, [0, 800], [0, value]);
}

export default function HomePage() {
  const heroBgY = useParallax(120);
  const metricsY = useParallax(-40);

  return (
    <SiteShell>
      {/* ── SECTION 1: FULL-BLEED HERO ── */}
      <section className="home-hero">
        <motion.div className="home-hero-bg" style={{ y: heroBgY }}>
          <Image
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80"
            alt="Modern technology workspace with digital analytics"
            fill
            priority
            sizes="100vw"
            fetchPriority="high"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkYPj/n4EBCxg5GRhgpkATYGT4DwWYGBgBABYlBv6P1+NYAAAAAElFTkSuQmCC"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div className="home-hero-overlay" />
        </motion.div>
        {/* ── Floating ambient orbs ── */}
        <div className="hero-grid-lines" />
        <motion.div
          className="hero-orb-float hero-orb-1"
          animate={{ scale: [1, 1.08, 0.95, 1], opacity: [0.3, 0.45, 0.25, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="hero-orb-float hero-orb-2"
          animate={{ scale: [1, 0.92, 1.06, 1], opacity: [0.25, 0.4, 0.2, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="hero-orb-float hero-orb-3"
          animate={{ scale: [1, 1.1, 0.96, 1], opacity: [0.15, 0.3, 0.18, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="container home-hero-content">
          <SkeletonReveal skeleton={<HeroSkeleton />} delay={120}>
            <FadeIn delay={0.1} y={16}>
              <p className="eyebrow">
                <Sparkles size={14} />
                Unity Consult — Digital transformation partner
              </p>
            </FadeIn>
            <FadeIn delay={0.2} y={16}>
              <h1 className="gradient-text">
                We build the digital infrastructure for serious service businesses.
              </h1>
            </FadeIn>
            <FadeIn delay={0.3} y={16}>
              <p className="hero-copy">
                From premium websites and custom CRM systems to SEO, marketing, branding, and compliance —
                we deliver structured, results-driven solutions for growth-focused companies.
              </p>
            </FadeIn>
            <FadeIn delay={0.4} y={12}>
              <div className="home-hero-cta-row">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/book" className="primary-button">
                    Start a consultation
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link href="/services" className="ghost-button">
                    Explore services
                  </Link>
                </motion.div>
              </div>
            </FadeIn>
            <FadeIn delay={0.5} y={8}>
              <motion.div
                className="home-hero-trust"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span>
                  <CheckCircle2 size={14} />
                  {company.socialProof.rating} delivery signal
                </span>
                <span>
                  <CheckCircle2 size={14} />
                  {company.socialProof.clients} clients served
                </span>
                <span>
                  <CheckCircle2 size={14} />
                  {company.socialProof.projects} projects delivered
                </span>
              </motion.div>
            </FadeIn>
          </SkeletonReveal>
        </div>
      </section>

      {/* ── SECTION 2: TRUST STRIP ── */}
      <ProofStrip items={trustSignals} />

      {/* ── SECTION 3: METRICS ── */}
      <motion.section className="home-metrics" style={{ y: metricsY }}>
        <div className="container">
          <SkeletonReveal skeleton={<MetricsGridSkeleton />} delay={120}>
            <StaggerContainer className="metrics-grid" staggerDelay={0.1}>
              {[
                { value: 120, suffix: "+", label: "Clients served", detail: "Across technology, growth, and compliance" },
                { value: 250, suffix: "+", label: "Projects delivered", detail: "From websites to enterprise CRM systems" },
                { value: 4.9, suffix: "/5", label: "Client satisfaction", detail: "Based on post-delivery feedback surveys" },
                { value: 8, suffix: "+", label: "Countries reached", detail: "Serving clients across global markets" },
              ].map((metric) => (
                <StaggerItem key={metric.label}>
                  <div className="home-metric-card">
                    <strong>
                      <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                    </strong>
                    <span>{metric.label}</span>
                    <small>{metric.detail}</small>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </SkeletonReveal>
        </div>
      </motion.section>

      {/* ── SECTION 4: EDITORIAL OPERATING MODEL ── */}
      <section className="home-editorial">
        <div className="container">
          <FadeIn>
            <div className="section-heading" style={{ marginBottom: "3.5rem" }}>
              <p className="eyebrow">How we operate</p>
              <h2>A connected system for sales, delivery, and operations</h2>
              <p className="section-description">
                Every engagement is backed by a unified platform — from the first enquiry to final delivery and ongoing support.
              </p>
            </div>
          </FadeIn>
          <SkeletonReveal skeleton={<EditorialBlockSkeleton />} delay={120}>
            <div className="editorial-blocks">
              {operatingSystem.map((item, index) => {
                const Icon = item.icon;
                return (
                  <FadeIn key={item.title} delay={index * 0.08} y={30}>
                    <div className={`editorial-block ${index % 2 === 1 ? "reversed" : ""}`}>
                      <div className="editorial-image">
                        <Image
                          src={serviceImages[index]}
                          alt={item.title}
                          width={900}
                          height={675}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                      <div className="editorial-content">
                        <Icon size={28} style={{ color: "var(--blue-strong)" }} />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <div className="editorial-meta">
                          <span>{index === 0 ? "Sales → delivery" : index === 1 ? "Client-facing" : index === 2 ? "Staff-facing" : "Infrastructure & security"}</span>
                          <span>Live in platform</span>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </SkeletonReveal>
        </div>
      </section>

      {/* ── SECTION 5: SERVICE GRID ── */}
      <PremiumSection
        eyebrow="Services"
        title="Six service lines designed for business growth"
        description="Each service includes clear pricing, delivery timelines, and a structured path from enquiry to completion."
      >
        <SkeletonReveal skeleton={<CardGridSkeleton count={6} />} delay={120}>
          <StaggerContainer className="service-visual-grid" staggerDelay={0.05}>
            {services.map((service) => (
              <StaggerItem key={service.slug}>
                <article
                  className="service-visual-card"
                  style={{ "--service-accent": service.accent } as Record<string, string>}
                >
                  <div className="service-card-media" style={{ background: `linear-gradient(135deg, ${service.accent}22, transparent)` }}>
                    <Image
                      src={service.media.card}
                      alt={service.media.alt}
                      width={600}
                      height={420}
                      sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ opacity: 0.85 }}
                    />
                  </div>
                  <div className="service-card-body">
                    <div className="card-topline">{service.category}</div>
                    <h3>{service.name}</h3>
                    <p>{service.short}</p>
                    <div className="service-card-proof">
                      <strong>{service.proofMetric}</strong>
                      <span>{service.proofLabel}</span>
                    </div>
                    <Link href={`/services/${service.slug}`} className="inline-link">
                      Explore service
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      {/* ── SECTION 6: CASE STUDIES ── */}
      <section className="home-case-studies">
        <div className="container">
          <FadeIn>
            <div className="section-heading" style={{ marginBottom: "3rem" }}>
              <p className="eyebrow">Client success stories</p>
              <h2>Real projects with measurable outcomes</h2>
              <p className="section-description">
                Explore how we have helped businesses scale with tailored digital solutions across technology, growth, and compliance.
              </p>
            </div>
          </FadeIn>
          <SkeletonReveal skeleton={<CaseStudyGridSkeleton />} delay={120}>
            <StaggerContainer className="case-study-grid" staggerDelay={0.08}>
              {portfolioItems.map((item, index) => (
                <StaggerItem key={item.slug}>
                  <Link href={`/portfolio/${item.slug}`} className="case-study-card">
                    <div className="case-study-media">
                      <Image
                        src={serviceImages[(index + 1) % serviceImages.length]}
                        alt={`${item.title} case study`}
                        width={800}
                        height={550}
                        sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <span className="case-study-badge">{item.category}</span>
                    </div>
                    <div className="case-study-body">
                      <h3>{item.title}</h3>
                      <div className="mini-meta">
                        <span>{item.client}</span>
                        <span>•</span>
                        <span>{item.year}</span>
                      </div>
                      <p>{item.summary}</p>
                      <span className="case-study-result">
                        <CheckCircle2 size={14} />
                        {item.result}
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </SkeletonReveal>
        </div>
      </section>

      {/* ── SECTION 7: DELIVERY JOURNEY ── */}
      <PremiumSection
        eyebrow="Delivery journey"
        title="From enquiry to invoice without operational drift"
        description="The platform makes the handoff between sales, project delivery, finance, and support seamless and transparent."
      >
        <SkeletonReveal skeleton={<TimelineSkeleton />} delay={120}>
          <StaggerContainer className="timeline" staggerDelay={0.07}>
            {["Lead capture", "Consultation", "Booking", "Payment", "Delivery", "Support"].map((item, index) => (
              <StaggerItem key={item}>
                <article className="timeline-step">
                  <span>{index + 1}</span>
                  <h3>{item}</h3>
                  <p>
                    {index === 0
                      ? "Public forms and booking routes create structured backend records."
                      : "Status, ownership, documents, invoices, and communication remain visible in portal/admin."}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      {/* ── SECTION 8: TESTIMONIALS ── */}
      <section className="home-testimonials">
        <div className="container">
          <FadeIn>
            <div className="section-heading" style={{ marginBottom: "3rem" }}>
              <p className="eyebrow">What our clients say</p>
              <h2>Trusted by founders, directors, and growth leaders</h2>
              <p className="section-description">
                We measure our success by the outcomes our clients achieve and the quality of our working relationships.
              </p>
            </div>
          </FadeIn>
          <SkeletonReveal skeleton={<TestimonialGridSkeleton />} delay={120}>
            <StaggerContainer className="testimonial-grid" staggerDelay={0.1}>
              {testimonials.map((item, index) => (
                <StaggerItem key={item.name}>
                  <div className="testimonial-card-home">
                    <p className="quote-mark">"</p>
                    <p>{item.quote}</p>
                    <div className="testimonial-author">
                        <motion.div
                        className="testimonial-avatar"
                        style={{ position: "relative" }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        viewport={{ once: true }}
                      >
                        <Image
                          src={testimonialAvatars[index % testimonialAvatars.length]}
                          alt={`${item.name} testimonial`}
                          fill
                          sizes="120px"
                          style={{ objectFit: "cover" }}
                        />
                      </motion.div>
                      <div className="testimonial-author-info">
                        <strong>{item.name}</strong>
                        <span>{item.role}</span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </SkeletonReveal>
        </div>
      </section>

      {/* ── SECTION 9: TRUST + SUPPORT ── */}
      <PremiumSection
        eyebrow="Trust & transparency"
        title="Built for reliability, backed by real workflows"
        description="What we promise on the surface is supported by actual portal and admin systems — not disconnected marketing claims."
      >
        <div className="split-grid">
          {[
            {
              icon: Sparkles,
              title: "Clear service scope and process",
              description: "Every engagement starts with structured pricing, defined deliverables, and visible milestones. No ambiguity, no surprises.",
            },
            {
              icon: MessageSquareText,
              title: "Communication built into every stage",
              description: "Messages, project updates, document sharing, and support ticketing are part of the delivery experience — not an afterthought.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title}>
                <article className="card">
                  <Icon size={24} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </PremiumSection>

      {/* ── SECTION 10: BLOG PREVIEW ── */}
      <PremiumSection
        eyebrow="Insights"
        title="Expert perspectives on digital growth"
        description="Practical guides, strategies, and industry perspectives to help you make informed business decisions."
      >
        <SkeletonReveal skeleton={<CardGridSkeleton count={3} />} delay={120}>
          <StaggerContainer className="card-grid" staggerDelay={0.06}>
            {blogPosts.map((post, index) => (
              <StaggerItem key={post.slug}>
                <article className="card">
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "12rem",
                      borderRadius: 20,
                      overflow: "hidden",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <Image
                      src={serviceImages[index % serviceImages.length]}
                      alt={`${post.title} article visual`}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-topline">{post.category}</div>
                  <h3>{post.title}</h3>
                  <p className="mini-meta">
                    {post.author} / {post.readTime}
                  </p>
                  <p>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="inline-link">
                    Read article
                    <ArrowRight size={16} />
                  </Link>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </SkeletonReveal>
      </PremiumSection>

      {/* ── SECTION 11: FINAL CTA ── */}
      <FadeIn>
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <p className="eyebrow" style={{ marginBottom: 0 }}>
                Ready to get started?
              </p>
              <h2>
                Turn service discovery, booking, delivery, and growth into one seamless experience.
              </h2>
              <p>
                Whether you need a new website, a custom CRM, SEO growth, or end-to-end digital strategy — we are here to help.
              </p>
              <div className="button-row">
                <Link href="/book" className="primary-button">
                  Start the booking flow
                  <ArrowRight size={16} />
                </Link>
                <Link href="/contact" className="ghost-button">
                  Talk to the team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </SiteShell>
  );
}
