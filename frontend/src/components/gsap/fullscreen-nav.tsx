"use client";
/**
 * Full-screen navigation — Osmo: osmo-bold-full-screen-navigation
 * Burger → overlay clips in, links stagger up huge. Close = reverse.
 */
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap/config";
import { EASE, DUR, STAGGER } from "@/lib/gsap/eases";

const LINKS = [
  { href: "/",          label: "Home" },
  { href: "/services",  label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about",     label: "About" },
  { href: "/pricing",   label: "Pricing" },
  { href: "/contact",   label: "Contact" },
];

export function FullscreenNav() {
  const [open, setOpen] = useState(false);
  const pathname        = usePathname();
  const overlayRef      = useRef<HTMLDivElement>(null);
  const listRef         = useRef<HTMLUListElement>(null);
  const tlRef           = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const overlay = overlayRef.current;
    const list    = listRef.current;
    if (!overlay || !list) return;
    const items = gsap.utils.toArray<HTMLElement>("li", list);

    gsap.set(overlay, { clipPath: "inset(0 0 100% 0)" });
    gsap.set(items,   { yPercent: 110, opacity: 0 });

    tlRef.current = gsap.timeline({ paused: true })
      .to(overlay, { clipPath: "inset(0 0 0% 0)", duration: DUR.medium, ease: EASE.page })
      .to(items,   { yPercent: 0, opacity: 1, duration: DUR.slow, ease: EASE.hero, stagger: STAGGER.wide }, "-=0.25");
  }, { scope: overlayRef });

  function toggle() {
    const tl = tlRef.current;
    if (!tl) return;
    if (!open) tl.play(); else tl.reverse();
    setOpen((v) => !v);
  }

  return (
    <>
      <button
        className={`fsn-burger${open ? " fsn-burger--open" : ""}`}
        onClick={toggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      <div ref={overlayRef} className="fsn-overlay" aria-hidden={!open} data-lenis-prevent>
        <button className="fsn-close" onClick={toggle} aria-label="Close menu">✕</button>
        <ul ref={listRef} className="fsn-list">
          {LINKS.map((l, i) => (
            <li key={l.href} className="fsn-item">
              <Link
                href={l.href}
                className={`fsn-link${pathname === l.href ? " fsn-link--active" : ""}`}
                onClick={toggle}
              >
                <span className="fsn-link__num">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
