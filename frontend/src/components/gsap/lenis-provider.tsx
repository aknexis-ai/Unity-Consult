"use client";
/**
 * Lenis smooth scroll — synced with GSAP ticker + ScrollTrigger.
 * Osmo: osmo-footer-parallax, osmo-stacking-cards-parallax
 */
import { useEffect, useRef, createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

// App-like surfaces (dashboards/portals) must keep NATIVE scrolling so inner
// panels — e.g. the sidebar menu and scrollable content — scroll on their own.
// Lenis is a global smooth-scroll that captures the wheel and drives the window,
// which is why scrolling over the sidebar used to move the whole page instead.
const NATIVE_SCROLL_PREFIXES = ["/admin", "/portal"];

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const useNativeScroll = NATIVE_SCROLL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  useEffect(() => {
    // Skip smooth-scroll entirely on dashboard/portal routes.
    if (useNativeScroll) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Sync Lenis RAF with GSAP ticker — critical for ScrollTrigger
    const onTick = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    // Mobile fix: ScrollTrigger start/end positions are measured once at
    // mount. On phones the address bar resize + late web-font load shift
    // layout, leaving scroll-triggered reveals firing at the wrong place
    // (or never). Recompute after fonts settle and on every resize/rotate.
    const refresh = () => { lenis.resize(); ScrollTrigger.refresh(); };
    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [useNativeScroll]);

  return <LenisCtx.Provider value={lenisRef.current}>{children}</LenisCtx.Provider>;
}
