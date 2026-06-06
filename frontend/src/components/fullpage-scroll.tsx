"use client";

import { useRef, useState, useCallback, useEffect, Children, type ReactNode } from "react";

const DURATION = 980;
const EASE = "cubic-bezier(.18,.9,.18,1)";

interface FullpageScrollProps {
  children: ReactNode;
  className?: string;
}

export function FullpageScroll({ children, className = "" }: FullpageScrollProps) {
  const [current, setCurrent] = useState(0);
  const isAnimating = useRef(false);
  const pages = Children.toArray(children);
  const total = pages.length;

  const goTo = useCallback((next: number) => {
    if (isAnimating.current) return;
    if (next < 0 || next >= total) return;
    isAnimating.current = true;
    setCurrent(next);
    setTimeout(() => { isAnimating.current = false; }, DURATION + 40);
  }, [total]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) goTo(current + 1);
      else goTo(current - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [current, goTo]);

  useEffect(() => {
    let startY = 0;
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      if (dy > 0) goTo(current + 1); else goTo(current - 1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [current, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(current + 1);
      if (e.key === "ArrowUp"   || e.key === "PageUp")   goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo]);

  return (
    <div className={`fp-root ${className}`} role="region" aria-label="Page sections">
      {pages.map((child, i) => (
        <div
          key={i}
          className="fp-page"
          aria-hidden={i !== current}
          style={{
            transform: `translateY(${i > current ? "100%" : "0%"})`,
            transition: `transform ${DURATION}ms ${EASE}`,
            zIndex: i === current ? 2 : i > current ? 1 : 0,
          }}
        >
          {child}
        </div>
      ))}
      <nav className="fp-dots" aria-label="Section navigation">
        {pages.map((_, i) => (
          <button
            key={i}
            className={`fp-dot${i === current ? " fp-dot--active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to section ${i + 1}`}
          />
        ))}
      </nav>
    </div>
  );
}
