"use client";

import { AnimatePresence, motion, useScroll, useSpring, useInView } from "framer-motion";
import { ReactNode, useEffect, useRef, useState, useCallback } from "react";

// ─── Scroll Progress Bar ──────────────────────────────────────

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 18, restDelta: 0.001 });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX }}
    />
  );
}

// ─── Fade In on Scroll ────────────────────────────────────────

export function FadeIn({
  children,
  delay = 0,
  className = "",
  y = 28,
  duration = 0.6,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  duration?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-48px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Slide In from Left/Right ─────────────────────────────────

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  className = "",
  once = true,
}: {
  children: ReactNode;
  direction?: "left" | "right" | "up";
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-48px 0px" });

  const xOffset = direction === "left" ? -60 : direction === "right" ? 60 : 0;
  const yOffset = direction === "up" ? 40 : 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: xOffset, y: yOffset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: xOffset, y: yOffset }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Container & Item ─────────────────────────────────

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.06,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Animation ───────────────────────────────────────

export function Float({
  children,
  y = 8,
  duration = 3,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [-y, y, -y] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Scale In on Hover ────────────────────────────────────────

export function ScaleOnHover({
  children,
  scale = 1.02,
  className = "",
}: {
  children: ReactNode;
  scale?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Magnetic Hover Button ────────────────────────────────────

export function MagneticButton({
  children,
  className = "",
  as = "button",
}: {
  children: ReactNode;
  className?: string;
  as?: "button" | "a" | "div";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const intensity = 0.2;
    ref.current.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </div>
  );
}

// ─── Parallax Tilt Card ───────────────────────────────────────

export function ParallaxTilt({
  children,
  className = "",
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      ref.current.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg)`;
    },
    [intensity],
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Video-Style Counter (Legacy) ─────────────────────────────

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1200,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-48px 0px" });
  const [count, setCount] = useState(value);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || animatedRef.current) return;
    animatedRef.current = true;

    setCount(0);

    const start = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

// ─── Skeleton Primitives ─────────────────────────────────────

const shimmerStyle = {
  background: "linear-gradient(90deg, rgba(15, 23, 42, 0.6) 25%, rgba(30, 41, 59, 0.6) 50%, rgba(15, 23, 42, 0.6) 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.8s ease-in-out infinite",
  borderRadius: "12px",
};

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonLine({ width = "100%", height = 16, className = "", style }: { width?: string; height?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, marginBottom: "0.55rem", ...style }}
    />
  );
}

export function SkeletonText({ lines = 3, className = "", width = "100%" }: { lines?: number; className?: string; width?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? width || "60%" : width || "100%"}
          height={14}
        />
      ))}
    </div>
  );
}

export function SkeletonHeading({ width = "70%", height = 32, className = "", style }: { width?: string; height?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <SkeletonLine width={width} height={height} className={className} style={style} />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`card ${className}`}
      style={{ padding: "1.75rem", minHeight: "12rem", pointerEvents: "none" }}
    >
      <SkeletonLine width="40%" height={14} />
      <SkeletonHeading width="80%" height={22} />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonImage({ aspectRatio = "16 / 9", className = "" }: { aspectRatio?: string; className?: string }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: "100%", aspectRatio, borderRadius: "20px" }}
    />
  );
}

export function SkeletonAvatar({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: size, height: size, borderRadius: "999px", flexShrink: 0 }}
    />
  );
}

export function SkeletonBadge({ width = "6rem", className = "" }: { width?: string; className?: string }) {
  return (
    <SkeletonLine width={width} height={28} className={className} style={{ borderRadius: "999px" }} />
  );
}

export function SkeletonButton({ width = "8rem", className = "" }: { width?: string; className?: string }) {
  return (
    <SkeletonLine width={width} height={44} className={className} style={{ borderRadius: "999px" }} />
  );
}

// ─── SkeletonReveal — Skeleton → Content Transition ──────────

export function SkeletonReveal({
  skeleton,
  children,
  delay = 150,
  className = "",
}: {
  skeleton: ReactNode;
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="skeleton"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {skeleton}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Legacy ScrollReveal (bridges old code) ───────────────────

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
