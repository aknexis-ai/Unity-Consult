"use client";
/**
 * SplitText line-reveal heading.
 * Lines clip from y:105%→0, staggered, scroll-triggered.
 * Osmo: osmo-draw-random-underline, bold-full-screen-navigation
 */
import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap/config";
import { EASE, DUR, STAGGER } from "@/lib/gsap/eases";

interface Props {
  as?: ElementType;
  children: string;
  className?: string;
  delay?: number;
  scrollTrigger?: boolean;
}

export function SplitHeading({ as: Tag = "h2", children, className = "", delay = 0, scrollTrigger = true }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const split = new SplitText(ref.current, { type: "lines", linesClass: "sh-line" });
    gsap.set(split.lines, { yPercent: 110, opacity: 0 });

    const tween = gsap.to(split.lines, {
      yPercent: 0,
      opacity: 1,
      duration: DUR.slow,
      ease: EASE.hero,
      stagger: STAGGER.lines,
      delay,
      ...(scrollTrigger && {
        scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
      }),
    });

    return () => { tween.kill(); split.revert(); };
  }, { scope: ref, dependencies: [children] });

  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={ref} className={`split-heading ${className}`}>{children}</Tag>
  );
}
