"use client";

/* ============================================================
   AURORA MOTION — shared deep-motion language for the redesign.
   One token set (easings + springs) so every animation feels
   like the same hand. Built on framer-motion v12.
   ============================================================ */

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { ReactNode, useRef, useCallback, ElementType, createElement } from "react";

// ── Tokens ──────────────────────────────────────────────────
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const SPRING = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 120, damping: 20 } as const;
export const SPRING_SNAP = { type: "spring", stiffness: 400, damping: 28 } as const;

const VIEWPORT = { once: true, margin: "-10% 0px" } as const;

// ── Reveal: blur + lift + fade (the house entrance) ─────────
export function Reveal({
  children,
  y = 48,
  delay = 0,
  blur = 12,
  duration = 0.85,
  className,
  as = "div",
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  blur?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const M = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

// ── Stagger group ───────────────────────────────────────────
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hide"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hide: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

const childVariants: Variants = {
  hide: { opacity: 0, y: 96, scale: 0.8, rotateX: -34, transformPerspective: 1000, filter: "blur(14px)" },
  show: {
    opacity: 1, y: 0, scale: 1, rotateX: 0, transformPerspective: 1000, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 80, damping: 13, mass: 0.95 },
  },
};

export function StaggerChild({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div className={className} style={style} variants={childVariants}>
      {children}
    </motion.div>
  );
}

// ── Kinetic text: word-by-word mask reveal for headings ─────
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) {
    return createElement(Tag, { className }, text);
  }

  const Container = motion[Tag as keyof typeof motion] as typeof motion.h2;
  const container: Variants = {
    hide: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: delay } },
  };
  const word: Variants = {
    hide: { y: "115%" },
    show: { y: "0%", transition: { duration: 0.55, ease: EASE } },
  };

  return (
    <Container
      className={className}
      aria-label={text}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={container}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", marginRight: "0.24em" }}
        >
          <motion.span
            style={{ display: "inline-block", willChange: "transform" }}
            variants={word}
            whileHover={{ y: -7, transition: { type: "spring", stiffness: 400, damping: 18 } }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Container>
  );
}

// ── Magnetic wrapper (cursor attraction) ────────────────────
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    },
    [reduce, strength],
  );
  const reset = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ display: "inline-flex", transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

// ── 3D tilt card (pointer-reactive depth) ───────────────────
export function Tilt({
  children,
  className,
  max = 9,
  glare = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ref.current.style.transform = `perspective(900px) rotateY(${(px - 0.5) * max}deg) rotateX(${-(py - 0.5) * max}deg)`;
      if (glare) {
        ref.current.style.setProperty("--mx", `${px * 100}%`);
        ref.current.style.setProperty("--my", `${py * 100}%`);
      }
    },
    [reduce, max, glare],
  );
  const reset = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", transformStyle: "preserve-3d", willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}

// ── Scroll-linked parallax helper ───────────────────────────
export function useParallax(distance = 120): MotionValue<number> {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, [0, 1], [0, distance]);
}

export function Parallax({
  children,
  distance = 80,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [distance, -distance]), {
    stiffness: 120,
    damping: 30,
  });
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

export { motion };
