"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Cross-browser scroll reveal. Works without `animation-timeline: view()`
// (Chromium-only), so every page's cards/sections fade + rise on scroll.
const SELECTORS = [
  ".au-card",
  ".au-cell",
  ".au-metric",
  ".au-quote",
  ".au-mock",
  ".au-head",
  ".glass",
  ".card",
  ".pricing-tier-card",
  ".service-visual-card",
  ".timeline-step",
  ".feature-card",
  ".section-heading",
  ".split-grid > *",
  ".card-grid > *",
  ".blog-card",
  ".portfolio-card",
].join(",");

export function MotionReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | undefined;

    const raf = requestAnimationFrame(() => {
      const vh = window.innerHeight;

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-in");
              io?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );

      const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTORS));
      els.forEach((el, i) => {
        // Skip anything framer-motion already drives (inline opacity/transform)
        // and anything already processed.
        if (el.style.opacity !== "" || el.style.transform !== "" || el.hasAttribute("data-reveal-done")) {
          return;
        }
        // Leave above-the-fold content visible (no flash) — only reveal below fold.
        if (el.getBoundingClientRect().top <= vh * 0.82) return;

        el.setAttribute("data-reveal-done", "");
        el.style.setProperty("--reveal-i", String(i % 6));
        el.classList.add("reveal-init");
        io?.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
