"use client";
/**
 * Momentum-based hover — Osmo: osmo-momentum-based-hover
 * Element follows cursor with GSAP quickTo lag (no InertiaPlugin needed).
 */
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";

export function MomentumHover({
  children, className = "", strength = 0.26,
}: { children: ReactNode; className?: string; strength?: number }) {
  const root  = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current, inn = inner.current;
    if (!el || !inn) return;
    const xTo = gsap.quickTo(inn, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(inn, "y", { duration: 0.55, ease: "power3.out" });
    const node = el; // capture non-null ref for closure

    function onMove(e: MouseEvent) {
      const r = node.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width  / 2) * strength);
      yTo((e.clientY - r.top  - r.height / 2) * strength);
    }
    function onLeave() { xTo(0); yTo(0); }

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => { node.removeEventListener("mousemove", onMove); node.removeEventListener("mouseleave", onLeave); };
  }, { scope: root });

  return (
    <div ref={root} className={`mh-root ${className}`}>
      <div ref={inner} className="mh-inner">{children}</div>
    </div>
  );
}
