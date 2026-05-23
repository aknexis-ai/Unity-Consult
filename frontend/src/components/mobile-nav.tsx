"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function MobileNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-nav">
      <button
        aria-label="Open menu"
        className="mobile-toggle"
        onClick={() => setOpen((s) => !s)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div className={`mobile-menu ${open ? "open" : ""}`} role="dialog" aria-hidden={!open}>
        <nav>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`mobile-nav-link${isActive(l.href, pathname) ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-actions">
          <Link href="/portal" className="ghost-button" onClick={() => setOpen(false)}>
            Portal
          </Link>
          <Link href="/book" className="primary-button" onClick={() => setOpen(false)}>
            Book Service
          </Link>
        </div>
      </div>
    </div>
  );
}
