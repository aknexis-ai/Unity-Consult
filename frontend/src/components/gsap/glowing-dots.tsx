"use client";
/**
 * Glowing interactive dots grid — Osmo: osmo-glowing-interactive-dots-grid
 * Dots ripple outward from cursor. Used as hero background layer.
 */
import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap/config";

const COLS = 22;
const ROWS = 12;

export function GlowingDots({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || typeof window === "undefined") return;

    container.innerHTML = "";
    const dots: HTMLElement[] = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const d = document.createElement("div");
        d.className = "gd-dot";
        d.dataset.c = String(c);
        d.dataset.r = String(r);
        container.appendChild(d);
        dots.push(d);
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mx   = (e.clientX - rect.left) / rect.width;
      const my   = (e.clientY - rect.top)  / rect.height;
      dots.forEach((dot) => {
        const dc   = parseInt(dot.dataset.c!) / (COLS - 1);
        const dr   = parseInt(dot.dataset.r!) / (ROWS - 1);
        const dist = Math.hypot(mx - dc, my - dr);
        const glow = Math.max(0, 1 - dist * 3.5);
        gsap.to(dot, { scale: 1 + glow * 2.2, opacity: 0.12 + glow * 0.88, duration: 0.35, ease: "power2.out", overwrite: "auto" });
      });
    };

    const onLeave = () => {
      gsap.to(dots, { scale: 1, opacity: 0.12, duration: 1.4, ease: "power2.out", stagger: { amount: 0.5, from: "random" } });
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => { container.removeEventListener("mousemove", onMove); container.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <div
      ref={ref}
      className={`gd-grid ${className}`}
      aria-hidden="true"
      style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
    />
  );
}
