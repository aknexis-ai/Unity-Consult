"use client";
/**
 * Stacking cards parallax — Osmo: osmo-stacking-cards-parallax
 * Cards pin, stack behind each other, scale + dim as user scrolls.
 */
import { useRef, Children, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";

export function StackingCards({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const cards = gsap.utils.toArray<HTMLElement>(".sc-card", ref.current);
    const total = cards.length;

    cards.forEach((card, i) => {
      if (i === total - 1) return; // last card never scales
      ScrollTrigger.create({
        trigger: card,
        start: "top top+=72",
        end: `+=${(total - i) * 380}`,
        pin: true,
        pinSpacing: false,
        scrub: 0.4,
        onUpdate(self) {
          gsap.set(card, {
            scale:      1 - self.progress * 0.06,
            yPercent:   self.progress * 6,
            filter:     `brightness(${1 - self.progress * 0.18})`,
          });
        },
      });
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, { scope: ref });

  return (
    <div ref={ref} className={`sc-container ${className}`}>
      {Children.map(children, (child, i) => (
        <div key={i} className="sc-card" style={{ zIndex: i + 1 }}>
          {child}
        </div>
      ))}
    </div>
  );
}
