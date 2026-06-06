"use client";
/**
 * Page loader — Osmo: osmo-crisp-loading-animation
 * Full-screen, counts 0→100%, progress bar, clips off upward.
 */
import { useRef, useEffect, useState } from "react";
import { gsap } from "@/lib/gsap/config";
import { EASE, DUR } from "@/lib/gsap/eases";

export function PageLoader() {
  const [gone, setGone]  = useState(false);
  const root  = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current, ct = count.current, br = bar.current;
    if (!el || !ct || !br) return;
    const obj = { v: 0 };
    const tl = gsap.timeline({ onComplete: () => setGone(true) });
    tl.to(obj, {
        v: 100, duration: 1.5, ease: "power2.inOut",
        onUpdate: () => { ct.textContent = `${Math.round(obj.v)}%`; },
      })
      .to(br,  { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
      .to({},  { duration: 0.15 })
      .to(el,  { yPercent: -105, duration: DUR.cinematic, ease: EASE.page });
    // Fail-safe: never trap the site behind the loader if the GSAP ticker
    // stalls (backgrounded tab, throttled rAF, GSAP init failure). Uses a
    // JS timer, not rAF, so it always fires. Slightly past the ~3.05s timeline.
    const safety = window.setTimeout(() => setGone(true), 4000);
    return () => { tl.kill(); window.clearTimeout(safety); };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="pl-root" aria-hidden="true">
      <span ref={count} className="pl-count">0%</span>
      <div className="pl-bar-track"><div ref={bar} className="pl-bar" /></div>
    </div>
  );
}
