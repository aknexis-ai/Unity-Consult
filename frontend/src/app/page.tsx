"use client";

import Link from "next/link";
import { type CSSProperties, type ReactNode, useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Sparkles,
  BriefcaseBusiness,
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  Code2,
  Workflow,
  Search,
  Megaphone,
  Scale,
  Palette,
  MessageSquare,
  Users,
  CalendarCheck,
  CreditCard,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import NumberFlow from "@number-flow/react";
import { useInView, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from "framer-motion";

import { SiteShell } from "@/components/site-shell";
import { GlowingDots } from "@/components/gsap/glowing-dots";
import { FlickSlider } from "@/components/gsap/flick-slider";
import { DrawUnderline } from "@/components/gsap/draw-underline";
import { DepthTiles } from "@/components/gsap/depth-tiles";
import { MomentumHover } from "@/components/gsap/momentum-hover";
import { SplitHeading } from "@/components/gsap/split-heading";
import { StackedSlider } from "@/components/gsap/stacked-slider";
import { StickySection, type StickyItem } from "@/components/gsap/sticky-section";
import { StackingCards } from "@/components/gsap/stacking-cards";
import {
  motion,
  Reveal,
  Stagger,
  StaggerChild,
  TextReveal,
  Magnetic,
  Tilt,
  SPRING_SNAP,
} from "@/components/motion/aurora-motion";
import { Split3D, Unmask, BlindsText, ScrambleText } from "@/components/motion/framer-fx";
import { ServiceOrbit } from "@/components/motion/service-orbit";
import { company } from "@/lib/company";
import { services } from "@/lib/services";
import { testimonials, portfolioItems, trustSignals } from "@/lib/mock-data";

function CountUp({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px" });
  const fallback = `${value.toLocaleString("en", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;

  return (
    <span ref={ref} className="au-metric__num">
      <NumberFlow
        className="au-metric__flow"
        value={inView ? value : 0}
        suffix={suffix}
        format={{ minimumFractionDigits: decimals, maximumFractionDigits: decimals }}
      />
      <span className="au-metric__fallback" aria-hidden>
        {fallback}
      </span>
    </span>
  );
}

function ScrollCard({
  children,
  className,
  index = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  style?: MotionStyle;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.94", "end 0.22"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 0.55, 1], [34 + index * 6, -8, 0]), {
    stiffness: 115,
    damping: 24,
  });
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.6, 1], [0.96, 1.015, 1]), {
    stiffness: 120,
    damping: 24,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.28, 1], [0.72, 1, 1]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    ["inset(18% 0% 0% 0% round 24px)", "inset(0% 0% 0% 0% round 22px)", "inset(0% 0% 0% 0% round 22px)"],
  );
  const filter = useTransform(scrollYProgress, [0, 0.4, 1], ["blur(10px)", "blur(0px)", "blur(0px)"]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? style : ({ ...style, y, scale, opacity, clipPath, WebkitClipPath: clipPath, filter } as MotionStyle)}
      data-scramble-card
    >
      {children}
    </motion.div>
  );
}

function GlowIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <motion.span className="au-cell__icon" whileHover={{ rotate: -6, scale: 1.08 }} transition={SPRING_SNAP}>
      <Icon size={24} strokeWidth={1.7} />
    </motion.span>
  );
}

const serviceIcons: Record<string, LucideIcon> = {
  "web-development": Code2,
  "crm-development": Workflow,
  "seo-services": Search,
  "digital-marketing": Megaphone,
  "legal-registration": Scale,
  "branding-design": Palette,
};

const operatingSystem = [
  {
    icon: BriefcaseBusiness,
    title: "Lead-to-project engine",
    description: "Booking, CRM, orders, project creation, invoicing, and payments - connected as one journey, not stitched-together tools.",
    span: "au-cell--wide",
    tag: "Sales to delivery",
    c: "#2F9E44",
  },
  {
    icon: LayoutDashboard,
    title: "Client delivery portal",
    description: "Projects, files, invoices, messages, and support in one place.",
    span: "au-cell--third",
    tag: "Client-facing",
    c: "#48CAE4",
  },
  {
    icon: BarChart3,
    title: "Admin command center",
    description: "Pipeline, catalog, finance, tickets, audit, and metrics.",
    span: "au-cell--third",
    tag: "Staff-facing",
    c: "#8E7BFF",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade infrastructure",
    description: "Secure auth, role-based access, payment processing, email, messaging, and a managed database underneath every screen.",
    span: "au-cell--wide",
    tag: "Infrastructure & security",
    c: "#FFD166",
  },
];

const workflow = [
  { t: "Enquiry", d: "Public forms + booking routes create structured records.", icon: MessageSquare, c: "#2F9E44" },
  { t: "Consultation", d: "Scope, timeline, and fit - confirmed with an expert.", icon: Users, c: "#48CAE4" },
  { t: "Booking", d: "One flow spins up lead, order, project, and invoice.", icon: CalendarCheck, c: "#FFD166" },
  { t: "Payment", d: "Secure processing with transparent, milestone-based billing.", icon: CreditCard, c: "#8E7BFF" },
  { t: "Delivery", d: "Live status, documents, and messages inside the portal.", icon: Rocket, c: "#FF7B67" },
  { t: "Growth", d: "Support, retainers, and reporting keep momentum going.", icon: TrendingUp, c: "#C8B6FF" },
];

const metricsData = [
  { value: 120, suffix: "+", label: "Clients served", detail: "Technology, growth & compliance" },
  { value: 250, suffix: "+", label: "Projects delivered", detail: "Websites to enterprise CRM" },
  { value: 4.9, suffix: "/5", decimals: 1, label: "Satisfaction", detail: "Post-delivery feedback" },
  { value: 8, suffix: "+", label: "Countries reached", detail: "Across global markets" },
];

export default function HomePage() {
  return (
    <SiteShell>
      <div className="au au-page--home">
        <section className="au-hero">
          <div className="au-hero__bg" aria-hidden />
          <div className="au-hero__grid-lines" aria-hidden />
          <GlowingDots className="au-hero__dots" />

          <div className="au-hero__inner">
            <div className="au-hero__copy">
              <span className="au-pill au-rise" style={{ animationDelay: "0.05s" }}>
                <span className="au-pill__dot" />
                <Sparkles size={14} style={{ color: "var(--au-accent)" }} />
                Unity Consult - Digital transformation partner
              </span>

              <SplitHeading as="h1" className="au-h1" scrollTrigger={false} delay={0.12}>
                We build the digital infrastructure for serious service businesses.
              </SplitHeading>

              <p className="au-lede au-rise" style={{ animationDelay: "0.2s" }}>
                From premium websites and custom CRM systems to SEO, marketing, branding, and
                compliance - we deliver one structured journey from{" "}
                <DrawUnderline as="span" trigger="scroll" className="au-aurora-text">enquiry to growth</DrawUnderline>.
              </p>

              <div className="au-hero__cta au-rise" style={{ animationDelay: "0.28s" }}>
                <Magnetic strength={0.3}>
                  <Link href="/book" className="au-btn au-btn--primary">
                    Start a consultation
                    <ArrowRight size={17} className="au-arrow" />
                  </Link>
                </Magnetic>
                <Link href="/services" className="au-btn au-btn--ghost">Explore services</Link>
              </div>

              <div className="au-hero__trust au-rise" style={{ animationDelay: "0.36s" }}>
                <span><Check size={15} /> {company.socialProof.rating} delivery signal</span>
                <span><Check size={15} /> {company.socialProof.clients} clients served</span>
                <span><Check size={15} /> {company.socialProof.projects} projects delivered</span>
              </div>
            </div>

            <div className="au-rise au-hero__orbit" style={{ animationDelay: "0.22s" }}>
              <ServiceOrbit />
            </div>
          </div>
        </section>

        <DepthTiles speed={36}>
          {trustSignals.map((s, i) => (
            <span key={i} className="au-strip__item">
              <Check size={14} style={{ color: "var(--au-accent)" }} />
              {s}
            </span>
          ))}
        </DepthTiles>

        <section className="au-section au-section--tight">
          <div className="au-container">
            <Stagger className="au-metrics" gap={0.1}>
              {metricsData.map((m, index) => (
                <StaggerChild key={m.label}>
                  <ScrollCard index={index} className="au-card-scroll">
                    <Tilt className="au-metric au-scramble-card" max={5}>
                      <CountUp value={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
                      <ScrambleText as="span" className="au-metric__label" text={m.label} trigger="group" />
                      <span className="au-metric__detail">{m.detail}</span>
                    </Tilt>
                  </ScrollCard>
                </StaggerChild>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="au-section">
          <div className="au-container">
            <div className="au-head" style={{ marginBottom: "2.6rem" }}>
              <span className="au-kicker">How we operate</span>
              <SplitHeading as="h2" className="au-h2">One connected system for sales, delivery &amp; operations</SplitHeading>
              <Reveal delay={0.1}>
                <p className="au-lede">
                  Every engagement runs on a unified platform - from the first enquiry to final
                  delivery and ongoing support. No scattered tools, no operational drift.
                </p>
              </Reveal>
            </div>

            <StickySection
              items={operatingSystem.map((item): StickyItem => {
                const Icon = item.icon;
                return {
                  label: item.tag,
                  heading: item.title,
                  body: item.description,
                  visual: (
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `radial-gradient(circle at 40% 40%, color-mix(in srgb, ${item.c} 18%, transparent), transparent 70%), var(--au-surface-2)`,
                    }}>
                      <span style={{
                        width: 80, height: 80, borderRadius: "50%",
                        display: "grid", placeItems: "center",
                        background: item.c, color: "#fff",
                        boxShadow: `0 16px 40px color-mix(in srgb, ${item.c} 40%, transparent)`,
                      }}>
                        <Icon size={36} strokeWidth={1.5} />
                      </span>
                    </div>
                  ),
                };
              })}
            />
          </div>
        </section>

        <section className="au-section">
          <div className="au-container">
            <div className="au-head" style={{ marginBottom: "2.6rem" }}>
              <span className="au-kicker">Services</span>
              <SplitHeading as="h2" className="au-h2">Six service lines built for business growth</SplitHeading>
              <Reveal delay={0.1}>
                <p className="au-lede">
                  Each service ships with clear pricing, delivery timelines, and a structured path
                  from enquiry to completion.
                </p>
              </Reveal>
            </div>

            <Stagger className="au-grid-3" gap={0.06}>
              {services.map((s, index) => {
                const Icon = serviceIcons[s.slug] ?? Sparkles;
                return (
                  <StaggerChild key={s.slug}>
                    <ScrollCard index={index % 3} className="au-card-scroll">
                      <MomentumHover strength={0.18}>
                      <Tilt className="au-svc au-scramble-card" max={6} style={{ ["--svc-base" as string]: s.accent } as CSSProperties}>
                        <div
                          className="au-svc__viz"
                          style={{ background: `radial-gradient(120% 120% at 25% 10%, ${s.accent}26, transparent 60%), var(--au-surface-2)` }}
                        >
                          <motion.span
                            style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: s.accent }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={SPRING_SNAP}
                          >
                            <Icon size={40} strokeWidth={1.4} />
                          </motion.span>
                        </div>
                        <ScrambleText as="span" className="au-svc__cat" text={s.category} trigger="group" />
                        <ScrambleText as="h3" className="au-h3" text={s.name} trigger="group" />
                        <p>{s.short}</p>
                        <div className="au-svc__proof">
                          <strong className="au-aurora-text">{s.proofMetric}</strong>
                          <span>{s.proofLabel}</span>
                        </div>
                        <Link href={`/services/${s.slug}`} className="au-link">
                          Explore service <ArrowUpRight size={16} />
                        </Link>
                      </Tilt>
                      </MomentumHover>
                    </ScrollCard>
                  </StaggerChild>
                );
              })}
            </Stagger>
          </div>
        </section>

        <section className="au-section">
          <div className="au-container">
            <Unmask>
              <div className="au-head au-head--center" style={{ marginBottom: "3rem" }}>
                <span className="au-kicker">Delivery journey</span>
                <SplitHeading as="h2" className="au-h2">From enquiry to growth, without the drift</SplitHeading>
              </div>
            </Unmask>
            <Stagger className="au-flow" gap={0.12}>
              {workflow.map((step, i) => {
                const Icon = step.icon;
                return (
                  <StaggerChild
                    key={step.t}
                    className="au-step"
                    style={{ ["--c" as string]: step.c, ["--d" as string]: `${i * 0.45}s` } as CSSProperties}
                  >
                    <span className="au-step__n" data-label={step.t} aria-label={step.t} role="img">
                      <Icon size={24} strokeWidth={2} />
                      <span className="au-step__badge">{i + 1}</span>
                    </span>
                  </StaggerChild>
                );
              })}
            </Stagger>
          </div>
        </section>

        <section className="au-section">
          <div className="au-container">
            <div className="au-head" style={{ marginBottom: "2.6rem" }}>
              <span className="au-kicker">Client success stories</span>
              <SplitHeading as="h2" className="au-h2">Real projects with measurable outcomes</SplitHeading>
            </div>
            <StackedSlider>
              {portfolioItems.map((item) => (
                  <Tilt key={item.slug} className="au-svc au-scramble-card" max={5} style={{ height: "100%" }}>
                    <Split3D className="au-svc__viz" axis="x">
                      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "linear-gradient(135deg, rgba(242,109,91,0.18), rgba(6,59,58,0.14)), var(--au-surface-2)" }}>
                        <span className="au-mono" style={{ fontSize: "2rem", fontWeight: 700, color: "var(--au-accent)" }}>{item.year}</span>
                      </div>
                    </Split3D>
                    <ScrambleText as="span" className="au-svc__cat" text={item.category} trigger="group" />
                    <ScrambleText as="h3" className="au-h3" text={item.title} trigger="group" />
                    <p style={{ fontSize: "0.82rem", color: "var(--au-text-mute)" }}>{item.client}</p>
                    <p>{item.summary}</p>
                    <span className="au-link" style={{ color: "var(--au-text-dim)" }}>
                      <Check size={15} style={{ color: "var(--au-accent)" }} /> {item.result}
                    </span>
                    {/* Explicit nav link; stopPropagation so it navigates instead
                        of triggering the StackedSlider's click-to-advance. */}
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="au-link"
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginTop: "0.2rem" }}
                    >
                      View case study <ArrowUpRight size={16} />
                    </Link>
                  </Tilt>
              ))}
            </StackedSlider>
          </div>
        </section>

        <section className="au-section">
          <div className="au-container">
            <div className="au-head" style={{ marginBottom: "2.6rem" }}>
              <span className="au-kicker">What clients say</span>
              <SplitHeading as="h2" className="au-h2">Trusted by founders, directors &amp; growth leaders</SplitHeading>
            </div>
            <FlickSlider>
              {testimonials.map((t) => (
                <div key={t.name} className="au-quote">
                  <span className="au-quote__mark">&ldquo;</span>
                  <p>{t.quote}</p>
                  <div className="au-quote__by">
                    <span className="au-quote__av">{t.name.split(" ").map((n) => n[0]).join("")}</span>
                    <span>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </span>
                  </div>
                </div>
              ))}
            </FlickSlider>
          </div>
        </section>

        <section className="au-section">
          <div className="au-container">
            <Reveal>
              <div className="au-cta">
                <div className="au-blinds" style={{ position: "absolute", inset: 0, opacity: 0.55 }} aria-hidden>
                  <BlindsText text="GROWTH" strips={7} />
                </div>
                <span className="au-kicker" style={{ justifyContent: "center", position: "relative" }}>Ready to get started?</span>
                <h2 className="au-h2" style={{ margin: "0.8rem auto 0", maxWidth: "20ch" }}>
                  Turn discovery, booking, delivery & growth into{" "}
                  <span className="au-aurora-text">one seamless experience</span>.
                </h2>
                <p className="au-lede" style={{ margin: "1.1rem auto 0", textAlign: "center" }}>
                  Whether you need a new website, a custom CRM, SEO growth, or end-to-end digital
                  strategy - we are here to help.
                </p>
                <div className="au-cta__row">
                  <Magnetic strength={0.3}>
                    <Link href="/book" className="au-btn au-btn--primary">
                      Start the booking flow <ArrowRight size={17} className="au-arrow" />
                    </Link>
                  </Magnetic>
                  <Link href="/contact" className="au-btn au-btn--ghost">Talk to the team</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
