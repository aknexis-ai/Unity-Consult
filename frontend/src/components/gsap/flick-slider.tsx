"use client";
/**
 * Flick cards slider — Osmo: osmo-flick-cards-slider
 * Draggable + InertiaPlugin momentum carousel with snap-to-card.
 */
import { useRef, Children, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, Draggable, InertiaPlugin } from "@/lib/gsap/config";

export function FlickSlider({ children, className = "" }: { children: ReactNode; className?: string }) {
  const viewRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const view  = viewRef.current;
    const track = trackRef.current;
    if (!view || !track) return;

    const raf = requestAnimationFrame(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".fls-card", track);
      if (!cards.length) return;
      const cardW = (cards[0].offsetWidth ?? 340) + 24;
      const minX  = -(cards.length - 1) * cardW;

      const [drag] = Draggable.create(track, {
        type: "x",
        inertia: true,
        bounds: { minX, maxX: 0 },
        edgeResistance: 0.65,
        cursor: "grab",
        activeCursor: "grabbing",
        snap: (v: number) => Math.round(v / cardW) * cardW,
        onPress()   { gsap.to(track, { scale: 0.985, duration: 0.15, ease: "power2.out" }); },
        onRelease() { gsap.to(track, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" }); },
      });
      return () => { drag?.kill(); };
    });
    return () => cancelAnimationFrame(raf);
  }, { scope: viewRef });

  return (
    <div ref={viewRef} className={`fls-viewport ${className}`}>
      <div ref={trackRef} className="fls-track">
        {Children.map(children, (child, i) => (
          <div key={i} className="fls-card">{child}</div>
        ))}
      </div>
    </div>
  );
}
