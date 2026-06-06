"use client";
/**
 * Stacked cards slider — Osmo: osmo-stacked-cards-slider
 * Cards in a z-stack. Autoplays every 5s; advance via card click, the
 * Prev/Next arrows, or the dots. The incoming top card slides in from the
 * side. Hovering the stack pauses autoplay.
 */
import { useRef, useState, useEffect, Children, type ReactNode } from "react";
import { gsap } from "@/lib/gsap/config";
import { EASE, DUR } from "@/lib/gsap/eases";

export function StackedSlider({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pages = Children.toArray(children);
  const total = pages.length;
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  const ref   = useRef<HTMLDivElement>(null);
  const busy  = useRef(false);
  const dir   = useRef(1);
  const first = useRef(true);

  function go(d: 1 | -1) {
    if (busy.current || total < 2) return;
    dir.current = d;
    setIdx((i) => (i + d + total) % total);
  }
  function goTo(target: number) {
    if (busy.current || target === idx) return;
    dir.current = target > idx ? 1 : -1;
    setIdx(target);
  }

  // Slide the incoming top card in on every change (skip the first paint).
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const top = ref.current?.querySelector<HTMLElement>(".ss2-card");
    if (!top) return;
    busy.current = true;
    gsap.fromTo(
      top,
      { xPercent: dir.current * 55, opacity: 0, rotation: dir.current * 5 },
      { xPercent: 0, opacity: 1, rotation: 0, duration: DUR.base, ease: EASE.page, onComplete: () => { busy.current = false; } },
    );
  }, [idx]);

  // Autoplay forward; pauses on hover and when there is nothing to cycle.
  useEffect(() => {
    if (paused || total < 2) return;
    const t = window.setInterval(() => {
      if (busy.current) return;
      dir.current = 1;
      setIdx((i) => (i + 1) % total);
    }, 5000);
    return () => window.clearInterval(t);
  }, [paused, total]);

  const order = Array.from({ length: Math.min(total, 4) }, (_, i) => (idx + i) % total);

  return (
    <div
      ref={ref}
      className={`ss2-root ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {order.map((oi, depth) => (
        <div
          key={`${oi}-${depth}`}
          className="ss2-card"
          style={{
            zIndex:        total - depth,
            transform:     depth === 0 ? "none" : `translateY(${depth * 12}px) scale(${1 - depth * 0.04})`,
            opacity:       1 - depth * 0.18,
            pointerEvents: depth === 0 ? "auto" : "none",
            cursor:        depth === 0 ? "pointer" : "default",
          }}
          onClick={depth === 0 ? () => go(1) : undefined}
        >
          {pages[oi]}
        </div>
      ))}

      <div className="ss2-controls">
        <button type="button" className="ss2-nav" onClick={() => go(-1)} aria-label="Previous case study">&#8249;</button>
        <div className="ss2-dots">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`ss2-dot${i === idx ? " is-active" : ""}`}
              aria-label={`Go to case study ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button type="button" className="ss2-nav" onClick={() => go(1)} aria-label="Next case study">&#8250;</button>
      </div>
    </div>
  );
}
