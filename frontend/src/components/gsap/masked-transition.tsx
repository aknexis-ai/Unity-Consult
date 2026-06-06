"use client";
/**
 * Page transition — smooth opacity fade on route change.
 * Safe: no full-screen overlay that can get stuck.
 */
import { useRef, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap/config";

export function MaskedTransition({ children }: { children: ReactNode }) {
  const ref      = useRef<HTMLDivElement>(null);
  const prevPath = useRef<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prevPath.current === pathname) return; // skip StrictMode double-fire
    prevPath.current = pathname;

    const tween = gsap.fromTo(el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
    );
    // Fail-safe: if the ticker stalls, the fromTo pins the wrapper at
    // opacity:0 and hides the whole page. gsap.set is synchronous (no ticker
    // needed), so this guarantees content becomes visible.
    const safety = window.setTimeout(
      () => gsap.set(el, { opacity: 1, y: 0, clearProps: "opacity,transform" }),
      700,
    );
    return () => { tween.kill(); window.clearTimeout(safety); };
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
