"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ArrowRight, LayoutDashboard, Mail, Phone, MessageCircle } from "lucide-react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";

import { company } from "@/lib/company";
import { RotateLink } from "@/components/motion/framer-fx";
import MobileNav from "./mobile-nav";
import { FullscreenNav } from "./gsap/fullscreen-nav";
import { FooterParallax } from "./gsap/footer-parallax";

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

const navItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.03, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <div className="site-shell">
      <motion.div className="scroll-progress-bar" style={{ scaleY, transformOrigin: "0% 50%" }} />
      <motion.header
        className={`topbar ${scrolled ? "topbar-scrolled" : ""}`}
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      >
        <div className="container nav-row">
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Link href="/" className="brand">
              <motion.span
                className="brand-mark"
                whileHover={{ scale: 1.05, rotate: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
              >
                UC
              </motion.span>
              <span>
                <strong>{company.name}</strong>
                <small>{company.tagline}</small>
              </span>
            </Link>
          </motion.div>
          <MobileNav links={mainLinks} />
          <nav className="nav">
            {mainLinks.map((link, i) => (
              <motion.div
                key={link.href}
                custom={i}
                variants={navItemVariants}
                initial={false}
                animate="visible"
              >
                <Link
                  href={link.href}
                  className={`nav-link${isActive(link.href, pathname) ? " active" : ""}`}
                >
                  <RotateLink label={link.label} />
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div
            className="nav-actions"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link href="/portal" className="ghost-button">
              <LayoutDashboard size={16} />
              Portal
            </Link>
            <Link href="/book" className="primary-button">
              Book Service
              <ArrowRight size={16} />
            </Link>
            <FullscreenNav />
          </motion.div>
        </div>
      </motion.header>
      <main>{children}</main>
      <motion.div
        className="floating-rail"
        initial={false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.a
          href={`mailto:${company.email}`}
          className="floating-pill floating-icon"
          aria-label="Email us"
          title="Email"
          whileHover={{ scale: 1.08, x: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Mail size={18} />
        </motion.a>
        <motion.a
          href={`tel:${company.phone.replace(/\s+/g, "")}`}
          className="floating-pill floating-icon"
          aria-label="Call us"
          title="Call"
          whileHover={{ scale: 1.08, x: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Phone size={18} />
        </motion.a>
        <motion.a
          href="/contact"
          className="floating-pill floating-icon"
          aria-label="Contact"
          title="Contact"
          whileHover={{ scale: 1.08, x: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <MessageCircle size={18} />
        </motion.a>
      </motion.div>
      <FooterParallax>
      <footer className="footer">
        <div className="container footer-grid">
          <motion.div
            className="glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-36px 0px" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="brand" style={{ marginBottom: "0.75rem" }}>
              <span className="brand-mark" style={{ width: 36, height: 36, fontSize: "0.75rem" }}>UC</span>
              <span>
                <strong style={{ fontSize: "1rem", color: "var(--text)", display: "block" }}>{company.name}</strong>
                <small style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginTop: "1px" }}>{company.tagline}</small>
              </span>
            </div>
            <p style={{ margin: "0 0 0.65rem", color: "var(--text-muted)", fontSize: "0.8rem", lineHeight: 1.5 }}>{company.description}</p>
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
            <div className="app-badge-row" aria-label="App installation and workspace badges" style={{ marginTop: "0.5rem" }}>
              {company.appBadges.map((badge) => (
                <span key={badge.label} className="app-badge">
                  <strong>{badge.label}</strong>
                  <small>{badge.detail}</small>
                </span>
              ))}
            </div>
          </motion.div>
          {[
            {
              title: "Contact",
              content: (
                <ul className="footer-list">
                  <li><a href={`mailto:${company.email}`} className="footer-link">{company.email}</a></li>
                  <li><a href={`tel:${company.phone.replace(/\s+/g, "")}`} className="footer-link">{company.phone}</a></li>
                  <li style={{ fontSize: "0.78rem" }}>{company.address}</li>
                  <li style={{ fontSize: "0.78rem" }}>{company.hours}</li>
                  <li className="footer-social-row">
                    <a href="#" className="footer-social-icon" aria-label="LinkedIn">in</a>
                    <a href="#" className="footer-social-icon" aria-label="Twitter/X">𝕏</a>
                    <a href="#" className="footer-social-icon" aria-label="Instagram">ig</a>
                    <a href="#" className="footer-social-icon" aria-label="YouTube">yt</a>
                  </li>
                </ul>
              ),
            },
            {
              title: "Company",
              content: (
                <div className="stack">
                  <Link href="/about" className="panel-link">About us</Link>
                  <Link href="/portfolio" className="panel-link">Portfolio</Link>
                  <Link href="/blog" className="panel-link">Blog & insights</Link>
                  <Link href="/careers" className="panel-link">Careers</Link>
                  <Link href="/privacy-policy" className="panel-link">Privacy Policy</Link>
                  <Link href="/terms-of-service" className="panel-link">Terms of Service</Link>
                  <Link href="/portal" className="panel-link">Client Portal</Link>
                  <span className="footer-badge-strip">
                    <span className="badge">PWA ready</span>
                    <span className="badge">GDPR</span>
                  </span>
                </div>
              ),
            },
          ].map((col, i) => (
            <motion.div
              key={col.title}
              className="glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-36px 0px" }}
              transition={{ duration: 0.4, delay: 0.08 + i * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <h4 style={{ fontSize: "0.85rem", marginBottom: "0.65rem" }}>{col.title}</h4>
              {col.content}
            </motion.div>
          ))}
        </div>
        <div className="container footer-bottom">
          <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <span className="pulse-dot" />
          <p className="footer-uptime">Operational</p>
        </div>
      </footer>
      </FooterParallax>
    </div>
  );
}
