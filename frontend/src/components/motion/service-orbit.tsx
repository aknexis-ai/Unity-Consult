"use client";

/* ============================================================
   SERVICE ORBIT — hero showpiece (replaces the static dashboard
   mock). Service icons float around the centred "Unity Consult"
   wordmark, connected to it by drawn-in lines with flowing
   "energy" dashes — the unity made visual. No cards, just icons.
   Inspired by playlist-gen.learnframer.site.
   ============================================================ */

import { useReducedMotion } from "framer-motion";
import {
  Code2,
  Workflow,
  Search,
  Megaphone,
  Scale,
  Palette,
  type LucideIcon,
} from "lucide-react";

import { motion } from "@/components/motion/aurora-motion";
import { services } from "@/lib/services";

const ICONS: Record<string, LucideIcon> = {
  "web-development": Code2,
  "crm-development": Workflow,
  "seo-services": Search,
  "digital-marketing": Megaphone,
  "legal-registration": Scale,
  "branding-design": Palette,
};

const SHORT: Record<string, string> = {
  "web-development": "Web",
  "crm-development": "CRM",
  "seo-services": "SEO",
  "digital-marketing": "Marketing",
  "legal-registration": "Legal",
  "branding-design": "Branding",
};

// Symmetric placements around the dead centre (percent of the square
// stage) so the wordmark sits exactly in the middle of the cluster.
// dx/dy = float amplitude in px, dur = float period, delay = phase.
const POS = [
  { top: "8%", left: "50%", dur: 3.6, delay: 0.0, dx: 0, dy: -26 }, // Web        — top
  { top: "24%", left: "82%", dur: 4.2, delay: 0.3, dx: 16, dy: 22 }, // CRM        — upper-right
  { top: "24%", left: "18%", dur: 3.9, delay: 0.5, dx: -16, dy: 24 }, // SEO        — upper-left
  { top: "72%", left: "82%", dur: 4.4, delay: 0.2, dx: 18, dy: -24 }, // Marketing  — lower-right
  { top: "72%", left: "18%", dur: 3.4, delay: 0.6, dx: -14, dy: -28 }, // Legal      — lower-left
  { top: "92%", left: "50%", dur: 4.6, delay: 0.4, dx: 0, dy: 26 }, // Branding   — bottom
];

export function ServiceOrbit() {
  const reduce = useReducedMotion();
  const tiles = services.slice(0, 6);

  return (
    <div className="au-orbit" role="img" aria-label="Unity Consult connects six services around one partner">
      <div className="au-orbit__glow" aria-hidden />

      {/* Orbital rings + radar pulse — replaces the straight connector lines.
          The energy radiates out from the centre logo to the services. */}
      {!reduce && (
        <div className="au-orbit__rings" aria-hidden>
          <span className="au-orbit__ring au-orbit__ring--1" />
          <span className="au-orbit__ring au-orbit__ring--2" />
          <span className="au-orbit__ring au-orbit__ring--3" />
          <span className="au-orbit__pulse" />
          <span className="au-orbit__pulse au-orbit__pulse--2" />
        </div>
      )}

      {tiles.map((s, i) => {
        const Icon = ICONS[s.slug] ?? Code2;
        const p = POS[i];
        return (
          <motion.div
            key={s.slug}
            className="au-orbit__tile-wrap"
            style={{ top: p.top, left: p.left }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, y: 16 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: 0.35 + i * 0.12, type: "spring", stiffness: 200, damping: 18 }}
          >
            <motion.div
              className="au-orbit__tile"
              animate={
                reduce
                  ? undefined
                  : {
                      x: [0, p.dx, 0, -p.dx, 0],
                      y: [0, p.dy, 0, -p.dy * 0.6, 0],
                      rotate: [0, p.dy > 0 ? 5 : -5, 0, p.dy > 0 ? -3 : 3, 0],
                    }
              }
              transition={
                reduce
                  ? undefined
                  : { duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }
              }
              whileHover={reduce ? undefined : { scale: 1.12, y: -6 }}
            >
              <span className="au-orbit__icon" style={{ ["--c" as string]: s.accent }}>
                <Icon size={26} strokeWidth={1.75} />
              </span>
              <span className="au-orbit__label">{SHORT[s.slug] ?? s.name}</span>
            </motion.div>
          </motion.div>
        );
      })}

      <motion.div
        className="au-orbit__center"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ delay: 0.1, type: "spring", stiffness: 160, damping: 18 }}
      >
        {/* Placeholder logo — swap the src with the real brand mark. */}
        <img
          className="au-orbit__logo"
          src="/images/brand/logo-placeholder.svg"
          alt="Unity Consult logo"
          width={96}
          height={96}
        />
      </motion.div>
    </div>
  );
}
