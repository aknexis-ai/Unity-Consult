"use client";
/**
 * useGsapReveal — ScrollTrigger fade+rise.
 * Replaces IntersectionObserver MotionReveal with GSAP precision + Lenis sync.
 */
import { useRef, useEffect, type MutableRefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import { EASE, DUR } from "@/lib/gsap/eases";

interface Opts {
  y?: number; delay?: number; duration?: number;
  ease?: string; stagger?: number; childSelector?: string;
}

export function useGsapReveal<T extends HTMLElement>(opts: Opts = {}): MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { y = 40, delay = 0, duration = DUR.base, ease = EASE.reveal, stagger = 0, childSelector } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = childSelector ? gsap.utils.toArray<HTMLElement>(childSelector, el) : [el];
    gsap.set(targets, { y, opacity: 0 });
    const tw = gsap.to(targets, {
      y: 0, opacity: 1, duration, ease, delay,
      stagger: stagger || undefined,
      scrollTrigger: { trigger: el, start: "top 87%", toggleActions: "play none none none" },
    });
    return () => {
      tw.kill();
      ScrollTrigger.getAll().filter((t) => t.vars.trigger === el).forEach((t) => t.kill());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
