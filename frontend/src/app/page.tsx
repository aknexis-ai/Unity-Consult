import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesCombined,
  MessageSquareText,
  ShieldCheck,
  Star,
  Sparkles,
} from "lucide-react";

import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { SiteShell } from "@/components/site-shell";
import { company } from "@/lib/company";
import {
  homepagePillars,
  metrics,
  portfolioItems,
  pricingHighlights,
  testimonials,
  trustSignals,
  blogPosts,
} from "@/lib/mock-data";
import { services } from "@/lib/services";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="hero-orb hero-orb-left" />
        <div className="hero-orb hero-orb-right" />
        <div className="container hero-grid">
          <div className="stack-lg">
            <p className="eyebrow">Enterprise digital headquarters</p>
            <h1>
              Trusted digital business partner for
              <span className="gradient-text"> growth-focused companies.</span>
            </h1>
            <p className="hero-copy">
              Strategy, execution, service booking, client delivery, and internal operations all brought together
              in one premium consulting ecosystem shaped around the PRD.
            </p>
            <div className="button-row">
              <Link href="/book" className="primary-button">
                Book a consultation
                <ArrowRight size={16} />
              </Link>
              <Link href="/portfolio" className="ghost-button">
                View portfolio
              </Link>
            </div>
            <div className="hero-meta-row">
              <span className="stat-pill">
                <Star size={14} />
                {company.socialProof.rating} rated delivery
              </span>
              <span className="stat-pill">{company.socialProof.projects} projects</span>
              <span className="stat-pill">{company.socialProof.clients} clients</span>
              <span className="stat-pill">{company.socialProof.countries} markets</span>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-panel-topline">
              <Sparkles size={16} />
              Live commercial snapshot
            </div>
            <div className="metric-board">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                  <small>{metric.detail}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div className="trust-track">
          {[...trustSignals, ...trustSignals].map((signal, index) => (
            <span key={`${signal}-${index}`} className="trust-chip">
              {signal}
            </span>
          ))}
        </div>
      </section>

      <Section
        eyebrow="Platform pillars"
        title="Built around the seven commercial functions in the PRD"
        description="The platform is framed to function as a digital headquarters, conversion engine, client workspace, and internal command center."
      >
        <div className="feature-grid">
          {homepagePillars.map((pillar) => (
            <article key={pillar.title} className="card feature-card">
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Services"
        title="Six core service lines are already mapped"
        description="Each service page includes overview, outcomes, workflow, intake fields, and related services."
      >
        <div className="card-grid">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Plans"
        title="Structured pricing signals across project and retainer work"
        description="The PRD calls for confidence, clarity, and premium positioning around service packaging."
      >
        <div className="card-grid">
          {pricingHighlights.map((item) => (
            <article key={item.title} className="card pricing-card">
              <div className="card-topline">{item.title}</div>
              <div className="price-block">{item.price}</div>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Trust surface"
        title="The homepage carries proof, process, and operational confidence"
        description="Operational trust signals connect the public site to secure portal access, payment state, delivery visibility, and measurable outcomes."
      >
        <div className="feature-grid">
          <article className="card">
            <BadgeCheck size={20} />
            <h3>Security and credibility</h3>
            <p>Provider health, payment readiness, role-based access, and CRM records are surfaced through the backend.</p>
          </article>
          <article className="card">
            <ChartNoAxesCombined size={20} />
            <h3>Measured outcomes</h3>
            <p>Operational and marketing metrics are staged throughout the public and admin views.</p>
          </article>
          <article className="card">
            <MessageSquareText size={20} />
            <h3>Structured communication</h3>
            <p>Support, revisions, and contact workflows are surfaced in portal and admin sections.</p>
          </article>
          <article className="card">
            <ShieldCheck size={20} />
            <h3>Production-managed</h3>
            <p>Content, messages, documents, invoices, projects, support, and analytics are wired into operational modules.</p>
          </article>
        </div>
      </Section>

      <Section
        eyebrow="Portfolio"
        title="Case-study structure is in place"
        description="These previews reflect the PRD's trust-showcase intent with clearer commercial framing."
      >
        <div className="card-grid">
          {portfolioItems.map((item) => (
            <article key={item.title} className="card">
              <div className="card-topline">{item.category}</div>
              <h3>{item.title}</h3>
              <p className="mini-meta">
                {item.client} • {item.year}
              </p>
              <p>{item.summary}</p>
              <p>{item.result}</p>
              <Link href={`/portfolio/${item.slug}`} className="inline-link">
                Read case study
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Testimonials"
        title="Confidence-building language for leadership and prospects"
        description="The PRD calls for trust, proof, and a sense of operational maturity."
      >
        <div className="card-grid">
          {testimonials.map((item) => (
            <article key={item.name} className="card testimonial-card">
              <p className="quote-mark">“</p>
              <p>{item.quote}</p>
              <div className="testimonial-meta">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Insights"
        title="A content layer ready for authority-building and SEO"
        description="A polished publishing surface matters because the PRD positions the platform as both a sales engine and a trust engine."
      >
        <div className="card-grid">
          {blogPosts.map((post) => (
            <article key={post.slug} className="card">
              <div className="card-topline">{post.category}</div>
              <h3>{post.title}</h3>
              <p className="mini-meta">
                {post.author} • {post.readTime}
              </p>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="inline-link">
                Read article
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <section className="section">
        <div className="container">
          <div className="final-cta">
            <div className="stack">
              <p className="eyebrow">Ready to move</p>
              <h2>Bring service discovery, conversion, and delivery visibility into one system.</h2>
              <p className="section-description">
                The public site, booking flow, client workspace, and admin command center are now aligned as one
                premium product direction.
              </p>
            </div>
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
    </SiteShell>
  );
}
