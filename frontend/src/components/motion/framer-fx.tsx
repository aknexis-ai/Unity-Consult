"use client";

/* ============================================================
   FRAMER-FX — the six requested learnframer effects, rebuilt
   in framer-motion (reduced-motion safe):
     • BlindsText   (text-high  — blinds strip reveal, background)
     • Split3D      (3d-split   — halves rotate together on scroll)
     • RotateLink   (rota-buta-hova — nav label 3D roll on hover)
     • ScrambleText (scramb-glitch — decode + glitch on hover)
     • Unmask       (unmask     — scroll-linked clip-path wipe)
   (text-lift lives in aurora-motion TextReveal: word lift + hover.)
   ============================================================ */

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState, useCallback, ElementType, createElement } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── BlindsText — big background text revealed by opening strips ──
export function BlindsText({
  text,
  className,
  strips = 6,
  alternate = true,
}: {
  text: string;
  className?: string;
  strips?: number;
  alternate?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", pointerEvents: "none" }} aria-hidden>
      <div className="au-blinds__text">{text}</div>
      {!reduce &&
        Array.from({ length: strips }).map((_, i) => (
          <motion.span
            key={i}
            className="au-blinds__strip"
            style={{
              top: `${(100 / strips) * i}%`,
              height: `${100 / strips}%`,
              transformOrigin: alternate && i % 2 ? "right" : "left",
            }}
            initial={{ scaleX: 1 }}
            whileInView={{ scaleX: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
          />
        ))}
    </div>
  );
}

// ── Split3D — element appears as two halves rotating into place ──
export function Split3D({
  children,
  className,
  axis = "x",
}: {
  children: ReactNode;
  className?: string;
  axis?: "x" | "y";
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const vp = { once: true, margin: "-12% 0px" } as const;
  const half = (clip: string, init: Record<string, number | string>, origin: string, delay: number) => (
    <motion.div
      style={{ position: "absolute", inset: 0, clipPath: clip, WebkitClipPath: clip, transformOrigin: origin, backfaceVisibility: "hidden" }}
      initial={{ opacity: 0, ...init }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0 }}
      viewport={vp}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className={className} style={{ position: "relative", perspective: 1100, overflow: "hidden" }}>
      {axis === "x"
        ? (
          <>
            {half("inset(0 0 50% 0)", { y: "-45%", rotateX: 40 }, "bottom", 0)}
            {half("inset(50% 0 0 0)", { y: "45%", rotateX: -40 }, "top", 0.06)}
          </>
        )
        : (
          <>
            {half("inset(0 50% 0 0)", { x: "-45%", rotateY: -40 }, "right", 0)}
            {half("inset(0 0 0 50%)", { x: "45%", rotateY: 40 }, "left", 0.06)}
          </>
        )}
      <div style={{ visibility: "hidden" }}>{children}</div>
    </div>
  );
}

// ── RotateLink — nav label 3D roll on hover (rota-buta-hova) ──
export function RotateLink({ label, className }: { label: string; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{label}</span>;
  return (
    <span className={`au-rota ${className ?? ""}`}>
      <span className="au-rota__inner">
        <span className="au-rota__face">{label}</span>
        <span className="au-rota__face au-rota__face--back">{label}</span>
      </span>
    </span>
  );
}

// ── ScrambleText — decode + glitch on hover (scramb-glitch) ──
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@/\\";
export function ScrambleText({
  text,
  className,
  as: Tag = "span",
  trigger = "hover",
  duration = 650,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  trigger?: "hover" | "view" | "group";
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  const [glitch, setGlitch] = useState(false);
  const raf = useRef<number>(0);
  const ref = useRef<HTMLElement>(null);

  const run = useCallback(() => {
    if (reduce) return;
    const start = performance.now();
    setGlitch(true);
    cancelAnimationFrame(raf.current);
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const revealed = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") s += " ";
        else if (i < revealed) s += text[i];
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else { setOut(text); setGlitch(false); }
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, duration, reduce]);

  useEffect(() => {
    if (trigger !== "view" || reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [trigger, run, reduce]);

  useEffect(() => {
    if (trigger !== "group" || reduce) return;
    const el = ref.current;
    const card = el?.closest("[data-scramble-card], .au-scramble-card");
    if (!card) return;
    card.addEventListener("mouseenter", run);
    card.addEventListener("focusin", run);
    return () => {
      card.removeEventListener("mouseenter", run);
      card.removeEventListener("focusin", run);
    };
  }, [trigger, run, reduce]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return createElement(
    Tag,
    {
      ref,
      className: `${className ?? ""} ${glitch ? "au-glitch" : ""}`,
      onMouseEnter: trigger === "hover" ? run : undefined,
      "data-text": out,
    },
    out,
  );
}

// ── Unmask — scroll-linked clip-path wipe reveal ──
export function Unmask({
  children,
  className,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  from?: "bottom" | "left";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.5"] });
  const p = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useTransform(p, (v) =>
    from === "left" ? `inset(0 ${v}% 0 0)` : `inset(${v}% 0 0 0)`,
  );
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ clipPath: clip, WebkitClipPath: clip }}>
      {children}
    </motion.div>
  );
}
