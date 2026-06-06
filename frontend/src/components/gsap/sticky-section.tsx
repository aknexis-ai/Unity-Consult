"use client";
/**
 * Sticky features — Osmo: osmo-sticky-features
 * Desktop: left panel sticks; right panels scroll one by one, each
 *          triggering a label + visual swap on the left.
 * Mobile:  the sticky split doesn't fit a single column (the visual
 *          scrolls out of view before its panel is read), so we render
 *          self-contained cards that reveal on scroll instead.
 */
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import { EASE, DUR } from "@/lib/gsap/eases";

export interface StickyItem {
  label: string;
  heading: string;
  body: string;
  visual?: ReactNode;
}

export function StickySection({ items, className = "" }: { items: StickyItem[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    // Desktop only — the mobile layout below has its own scroll reveal.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) return;

    const panels  = gsap.utils.toArray<HTMLElement>(".ss-panel", ref.current);
    const labels  = gsap.utils.toArray<HTMLElement>(".ss-label", ref.current);
    const visuals = gsap.utils.toArray<HTMLElement>(".ss-visual", ref.current);

    function activate(i: number) {
      labels.forEach((l, j) => gsap.to(l, {
        color:      j === i ? "var(--au-accent)" : "var(--au-text-mute)",
        fontWeight: j === i ? 700 : 400,
        duration: DUR.fast, ease: EASE.snap,
      }));
      visuals.forEach((v, j) => gsap.to(v, {
        opacity: j === i ? 1 : 0,
        scale:   j === i ? 1 : 0.93,
        duration: DUR.base, ease: EASE.reveal,
      }));
    }

    activate(0);
    // Track only our own triggers so cleanup doesn't nuke the rest of the page.
    const triggers = panels.map((panel, i) =>
      ScrollTrigger.create({
        trigger: panel,
        start: "top center",
        end: "bottom center",
        onEnter: () => activate(i),
        onEnterBack: () => activate(i),
      }),
    );

    return () => triggers.forEach((t) => t.kill());
  }, { scope: ref });

  return (
    <>
      <div ref={ref} className={`ss-root ${className}`}>
        <div className="ss-left">
          <div className="ss-labels">{items.map((it, i) => <span key={i} className="ss-label">{it.label}</span>)}</div>
          <div className="ss-visual-layer">
            {items.map((it, i) => (
              <div key={i} className="ss-visual" style={{ opacity: i === 0 ? 1 : 0, scale: "1" }}>
                {it.visual ?? <div className="ss-visual-placeholder"><span>{it.label}</span></div>}
              </div>
            ))}
          </div>
        </div>
        <div className="ss-right">
          {items.map((it, i) => (
            <div key={i} className="ss-panel">
              <p className="au-kicker">{it.label}</p>
              <h3>{it.heading}</h3>
              <p>{it.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked self-contained cards, each revealing on scroll. */}
      <div className={`ss-mobile ${className}`}>
        {items.map((it, i) => (
          <motion.article
            key={i}
            className="ss-card"
            initial={{ opacity: 0, y: 44, scale: 0.95, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
          >
            <motion.div
              className="ss-card__visual"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              {it.visual ?? <div className="ss-visual-placeholder"><span>{it.label}</span></div>}
            </motion.div>
            <p className="au-kicker">{it.label}</p>
            <h3>{it.heading}</h3>
            <p>{it.body}</p>
          </motion.article>
        ))}
      </div>
    </>
  );
}
