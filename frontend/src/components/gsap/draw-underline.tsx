"use client";
/**
 * Draw SVG underline — Osmo: osmo-draw-random-underline
 * Scroll or hover triggers wavy SVG underline via DrawSVGPlugin.
 */
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, DrawSVGPlugin, ScrollTrigger } from "@/lib/gsap/config";
import { DUR, EASE } from "@/lib/gsap/eases";

export function DrawUnderline({
  children, as: Tag = "span", className = "", trigger = "scroll", color = "var(--au-accent)",
}: {
  children: string; as?: "h1"|"h2"|"h3"|"h4"|"span"; className?: string;
  trigger?: "hover"|"scroll"; color?: string;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const path = pathRef.current, root = rootRef.current;
    if (!path || !root) return;
    gsap.set(path, { drawSVG: "0%" });

    if (trigger === "scroll") {
      gsap.to(path, { drawSVG: "100%", duration: DUR.medium, ease: EASE.reveal,
        scrollTrigger: { trigger: root, start: "top 88%", toggleActions: "play none none none" } });
    } else {
      const draw   = () => gsap.to(path, { drawSVG: "100%", duration: DUR.base, ease: EASE.reveal });
      const undraw = () => gsap.to(path, { drawSVG: "0%",   duration: DUR.fast, ease: EASE.snap });
      root.addEventListener("mouseenter", draw);
      root.addEventListener("mouseleave", undraw);
      return () => { root.removeEventListener("mouseenter", draw); root.removeEventListener("mouseleave", undraw); };
    }
  }, { scope: rootRef });

  return (
    <span ref={rootRef} className={`du-root ${className}`} style={{ display: "inline-block", position: "relative" }}>
      <Tag style={{ display: "inline" } as React.CSSProperties}>{children}</Tag>
      <svg className="du-svg" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
        <path ref={pathRef} d="M2 7 C30 3, 70 10, 100 6 S160 2, 198 7"
          fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}
