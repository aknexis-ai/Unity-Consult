"use client";
/**
 * Footer parallax — Osmo: osmo-footer-parallax-effect
 * Footer translates into view from below on scroll approach.
 */
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";

export function FooterParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el,
      { y: 72, opacity: 0.5 },
      { y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "top 70%", scrub: 1.2 },
      }
    );
    return () => { ScrollTrigger.getAll().filter((t) => t.vars.trigger === el).forEach((t) => t.kill()); };
  }, { scope: ref });

  return <div ref={ref} className="fp-wrap">{children}</div>;
}
