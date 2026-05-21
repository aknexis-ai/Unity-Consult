import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight, LayoutDashboard, PhoneCall } from "lucide-react";

import { company } from "@/lib/company";
import MobileNav from "./mobile-nav";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="container nav-row">
          <Link href="/" className="brand">
            <span className="brand-mark">UC</span>
            <span>
              <strong>{company.name}</strong>
              <small>{company.tagline}</small>
            </span>
          </Link>
          <MobileNav links={mainLinks} />
          <nav className="nav">
            {mainLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link href="/portal" className="ghost-button">
              <LayoutDashboard size={16} />
              Portal
            </Link>
            <Link href="/book" className="primary-button">
              Book Service
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <div className="floating-rail">
        <a href={`mailto:${company.email}`} className="floating-pill">
          Email
        </a>
        <a href={`tel:${company.phone.replace(/\s+/g, "")}`} className="floating-pill">
          Call
        </a>
        <a href="/contact" className="floating-pill">
          Contact
        </a>
      </div>
      <footer className="footer">
        <div className="container footer-grid">
          <div className="glass">
            <div className="brand" style={{ marginBottom: "1.5rem" }}>
              <span className="brand-mark">UC</span>
              <span>
                <strong style={{ fontSize: "1.25rem", color: "#fff", display: "block" }}>{company.name}</strong>
                <small style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.4)", display: "block", marginTop: "2px" }}>{company.tagline}</small>
              </span>
            </div>
            <p style={{ marginTop: 0 }}>{company.description}</p>
            <div className="app-badge-row" aria-label="App installation and workspace badges">
              {company.appBadges.map((badge) => (
                <span key={badge.label} className="app-badge">
                  <strong>{badge.label}</strong>
                  <small>{badge.detail}</small>
                </span>
              ))}
            </div>
            <div className="footer-metrics">
              <div className="metric-item">
                <span className="metric-number">{company.socialProof.rating}</span>
                <span className="metric-label">★ Rating</span>
              </div>
              <div className="metric-item">
                <span className="metric-number">{company.socialProof.projects}</span>
                <span className="metric-label">Projects</span>
              </div>
              <div className="metric-item">
                <span className="metric-number">{company.socialProof.clients}</span>
                <span className="metric-label">Clients</span>
              </div>
            </div>
          </div>
          <div className="glass">
            <h4>Contact</h4>
            <ul className="footer-list">
              <li>
                <a href={`mailto:${company.email}`} className="footer-link">
                  {company.email}
                </a>
              </li>
              <li>
                <a href={`tel:${company.phone.replace(/\s+/g, "")}`} className="footer-link">
                  {company.phone}
                </a>
              </li>
              <li>{company.address}</li>
              <li>{company.hours}</li>
            </ul>
          </div>
          <div className="glass">
            <h4>Quick actions</h4>
            <div className="stack">
              <Link href="/book" className="panel-link">
                <ArrowRight size={16} />
                Start a booking
              </Link>
              <Link href="/contact" className="panel-link">
                <PhoneCall size={16} />
                Contact channels
              </Link>
              <Link href="/pricing" className="panel-link">
                <LayoutDashboard size={16} />
                Review pricing
              </Link>
            </div>
          </div>
          <div className="glass">
            <h4>Company</h4>
            <div className="stack">
              <Link href="/privacy-policy" className="panel-link">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="panel-link">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
