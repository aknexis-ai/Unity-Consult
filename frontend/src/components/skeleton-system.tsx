import {
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  SkeletonCard,
  SkeletonHeading,
  SkeletonImage,
  SkeletonLine,
  SkeletonText,
} from "./motion-primitives";

// ─── Hero Skeleton ────────────────────────────────────────────

export function HeroSkeleton() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", padding: "4rem 0" }}>
      <div style={{ width: "100%", maxWidth: "880px" }}>
        <SkeletonBadge width="14rem" />
        <div style={{ height: "0.75rem" }} />
        <SkeletonHeading width="90%" height={48} />
        <div style={{ height: "0.5rem" }} />
        <SkeletonHeading width="75%" height={48} />
        <div style={{ height: "1.25rem" }} />
        <SkeletonText lines={2} />
        <div style={{ height: "1.5rem" }} />
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <SkeletonButton width="10rem" />
          <SkeletonButton width="10rem" />
        </div>
        <div style={{ height: "1.25rem" }} />
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <SkeletonLine width="10rem" height={16} />
          <SkeletonLine width="10rem" height={16} />
          <SkeletonLine width="10rem" height={16} />
        </div>
      </div>
    </div>
  );
}

// ─── Compact Hero Skeleton ────────────────────────────────────

export function CompactHeroSkeleton() {
  return (
    <div style={{ padding: "3rem 0", maxWidth: "880px" }}>
      <SkeletonLine width="12rem" height={14} />
      <div style={{ height: "0.75rem" }} />
      <SkeletonBadge width="8rem" />
      <div style={{ height: "1rem" }} />
      <SkeletonHeading width="85%" height={42} />
      <div style={{ height: "1rem" }} />
      <SkeletonText lines={2} />
      <div style={{ height: "1.25rem" }} />
      <SkeletonImage aspectRatio="21 / 9" />
    </div>
  );
}

// ─── Section Heading Skeleton ─────────────────────────────────

export function SectionHeadingSkeleton() {
  return (
    <div style={{ textAlign: "center", marginBottom: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <SkeletonBadge width="8rem" />
      <div style={{ height: "0.75rem" }} />
      <SkeletonHeading width="60%" height={32} />
      <div style={{ height: "0.5rem" }} />
      <SkeletonText lines={1} width="40rem" />
    </div>
  );
}

// ─── Card Grid Skeleton ───────────────────────────────────────

export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ─── Metrics Grid Skeleton ────────────────────────────────────

export function MetricsGridSkeleton() {
  return (
    <div className="metrics-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="home-metric-card" style={{ pointerEvents: "none" }}>
          <SkeletonHeading width="40%" height={38} />
          <div style={{ height: "0.4rem" }} />
          <SkeletonLine width="60%" height={16} />
          <div style={{ height: "0.25rem" }} />
          <SkeletonLine width="50%" height={12} />
        </div>
      ))}
    </div>
  );
}

// ─── Editorial Block Skeleton ─────────────────────────────────

export function EditorialBlockSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="editorial-blocks">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="editorial-block" style={{ pointerEvents: "none" }}>
          <SkeletonImage aspectRatio="4 / 3" />
          <div>
            <SkeletonLine width="2.5rem" height={28} />
            <div style={{ height: "0.75rem" }} />
            <SkeletonHeading width="80%" height={28} />
            <div style={{ height: "0.5rem" }} />
            <SkeletonText lines={3} />
            <div style={{ height: "0.75rem" }} />
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <SkeletonBadge width="8rem" />
              <SkeletonBadge width="6rem" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Case Study Grid Skeleton ─────────────────────────────────

export function CaseStudyGridSkeleton() {
  return (
    <div className="case-study-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="case-study-card" style={{ pointerEvents: "none" }}>
          <SkeletonImage aspectRatio="16 / 11" />
          <div style={{ padding: "1.5rem", display: "grid", gap: "0.65rem" }}>
            <SkeletonHeading width="70%" height={18} />
            <SkeletonLine width="50%" height={12} />
            <SkeletonText lines={2} />
            <SkeletonBadge width="7rem" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Testimonial Grid Skeleton ────────────────────────────────

export function TestimonialGridSkeleton() {
  return (
    <div className="testimonial-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="testimonial-card-home" style={{ pointerEvents: "none" }}>
          <SkeletonLine width="2rem" height={24} />
          <SkeletonText lines={3} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", paddingTop: "0.5rem", borderTop: "1px solid rgba(148,163,184,0.1)" }}>
            <SkeletonAvatar size={44} />
            <div>
              <SkeletonLine width="6rem" height={14} />
              <div style={{ height: "0.25rem" }} />
              <SkeletonLine width="8rem" height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Timeline Skeleton ────────────────────────────────────────

export function TimelineSkeleton() {
  return (
    <div className="timeline">
      {[1, 2, 3].map((i) => (
        <div key={i} className="timeline-step" style={{ pointerEvents: "none" }}>
          <SkeletonAvatar size={32} />
          <div style={{ height: "0.5rem" }} />
          <SkeletonHeading width="60%" height={20} />
          <SkeletonText lines={2} />
        </div>
      ))}
    </div>
  );
}

// ─── Form Skeleton (Auth/Contact) ─────────────────────────────

export function FormSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <div className="stack">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <SkeletonLine width="4rem" height={12} />
          <div style={{ height: "0.4rem" }} />
          <SkeletonLine width="100%" height={44} style={{ borderRadius: "14px" }} />
        </div>
      ))}
      <SkeletonButton width="8rem" />
    </div>
  );
}

// ─── Auth Card Skeleton ───────────────────────────────────────

export function AuthCardSkeleton() {
  return (
    <div className="container auth-card card" style={{ pointerEvents: "none" }}>
      <SkeletonHeading width="40%" height={32} style={{ margin: "0 auto 2rem" }} />
      <div className="stack">
        <div>
          <SkeletonLine width="3rem" height={12} />
          <div style={{ height: "0.4rem" }} />
          <SkeletonLine width="100%" height={44} style={{ borderRadius: "14px" }} />
        </div>
        <div>
          <SkeletonLine width="4rem" height={12} />
          <div style={{ height: "0.4rem" }} />
          <SkeletonLine width="100%" height={44} style={{ borderRadius: "14px" }} />
        </div>
        <SkeletonButton width="8rem" />
      </div>
      <div style={{ height: "1.5rem" }} />
      <SkeletonLine width="14rem" height={14} style={{ margin: "0 auto" }} />
    </div>
  );
}

// ─── Detail Page Skeleton ─────────────────────────────────────

export function DetailPageSkeleton() {
  return (
    <div>
      <CompactHeroSkeleton />
      <div style={{ height: "2rem" }} />
      <SectionHeadingSkeleton />
      <div className="split-grid">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

// ─── Pricing Grid Skeleton ────────────────────────────────────

export function PricingGridSkeleton() {
  return (
    <div className="card-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card pricing-card" style={{ pointerEvents: "none" }}>
          <SkeletonBadge width="6rem" />
          <SkeletonHeading width="70%" height={22} />
          <SkeletonText lines={2} />
          <SkeletonHeading width="40%" height={28} />
          <SkeletonLine width="50%" height={14} />
          <SkeletonText lines={2} />
        </div>
      ))}
    </div>
  );
}

// ─── Contact Page Skeleton ────────────────────────────────────

export function ContactPageSkeleton() {
  return (
    <div>
      <SectionHeadingSkeleton />
      <div className="premium-contact-grid">
        <div className="card glass" style={{ pointerEvents: "none" }}>
          <SkeletonBadge width="10rem" />
          <div style={{ height: "0.5rem" }} />
          <SkeletonHeading width="60%" height={24} />
          <div style={{ height: "1rem" }} />
          <FormSkeleton fields={4} />
        </div>
        <div className="card glass" style={{ pointerEvents: "none" }}>
          <SkeletonBadge width="8rem" />
          <div style={{ height: "0.5rem" }} />
          <SkeletonHeading width="60%" height={24} />
          <div style={{ height: "1rem" }} />
          <SkeletonText lines={4} />
        </div>
      </div>
    </div>
  );
}
