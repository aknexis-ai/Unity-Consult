"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Menu, LogOut } from "lucide-react";
import { authApi } from "@/lib/api/resources";
import { useAuthStore } from "@/lib/stores/auth-store";

type NavItem = {
  href: string;
  label: string;
};

export function DashboardShell({
  title,
  subtitle,
  navItems,
  children,
}: {
  title: string;
  subtitle: string;
  navItems: NavItem[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth > 720,
  );
  const router = useRouter();
  const clearSession = useAuthStore((s) => s.clearSession);

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/portal") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const activeItem = navItems.find((item) => isActive(item.href));
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors on logout so local state is always cleared.
    }
    clearSession();
    router.push("/login");
  };

  return (
    <div className={`dashboard-shell ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
      <aside className="dashboard-sidebar glass">
        <button
          type="button"
          className="dashboard-menu-toggle"
          aria-label={isSidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
          aria-expanded={isSidebarOpen}
          onClick={() => setIsSidebarOpen((current) => !current)}
        >
          <Menu size={22} />
        </button>
        <div>
          <Link href="/" className="dashboard-back-link inline-link">
            <ArrowLeft size={16} />
            <span>Back to Website</span>
          </Link>
          <div className="dashboard-sidebar-copy">
            <p className="eyebrow">Workspace</p>
            <h2>{title}</h2>
            <p className="muted">{subtitle}</p>
          </div>
        </div>
        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? "active" : undefined}
              aria-current={isActive(item.href) ? "page" : undefined}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-mobile-header glass">
          <button
            type="button"
            className="dashboard-menu-toggle"
            aria-label={isSidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen((current) => !current)}
          >
            <Menu size={22} />
          </button>
          <div className="dashboard-mobile-section">
            <p className="eyebrow">Current Section</p>
            <strong>{activeItem?.label ?? title}</strong>
          </div>
          <button type="button" className="dashboard-logout-icon" aria-label="Logout" title="Logout" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
        <div className="dashboard-topbar glass">
          <div>
            <p className="eyebrow">Current Section</p>
            <strong>{activeItem?.label ?? title}</strong>
          </div>
          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={handleLogout}
            >
              <LogOut size={16} style={{ marginRight: 8 }} />
              Logout
            </button>
          </div>
        </div>
        <div className="dashboard-content glass">{children}</div>
      </main>
    </div>
  );
}
