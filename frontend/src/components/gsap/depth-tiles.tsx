"use client";
/**
 * Depth tiles infinite loop — Osmo: osmo-depth-tiles-infinite-loop
 * Marquee with scroll-velocity speed boost. Use for logo/trust strips.
 */
import { useRef, Children, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";

export function DepthTiles({ children, speed = 38, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current, outer = outerRef.current;
    if (!track || !outer) return;

    const raf = requestAnimationFrame(() => {
      const halfW = track.scrollWidth / 2;
      if (halfW <= 0) return;

      const loop = gsap.to(track, {
        x: -halfW, duration: speed, ease: "none", repeat: -1,
        modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % halfW) },
      });

      ScrollTrigger.create({
        trigger: outer, start: "top bottom", end: "bottom top",
        onUpdate(self) {
          const boost = 1 + Math.abs(self.getVelocity()) / 2000;
          loop.timeScale(boost);
          gsap.to(loop, { timeScale: 1, duration: 1.5, ease: "power2.out", overwrite: "auto", delay: 0.1 });
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().filter((t) => t.vars.trigger === outer).forEach((t) => t.kill());
    };
  }, { scope: outerRef });

  const doubled = [...Children.toArray(children), ...Children.toArray(children)];

  return (
    <div ref={outerRef} className={`dt-outer ${className}`}>
      <div ref={trackRef} className="dt-track">
        {doubled.map((child, i) => <div key={i} className="dt-tile">{child}</div>)}
      </div>
    </div>
  );
}
