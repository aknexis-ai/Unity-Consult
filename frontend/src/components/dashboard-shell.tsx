"use client";

import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Menu, LogOut } from "lucide-react";
import { authApi } from "@/lib/api/resources";
import { useAuthStore } from "@/lib/stores/auth-store";

type NavItem = {
  href: string;
  label: string;
  roles?: string[];
  requiredPermission?: string;
};

function hasPermission(user: { role: string; permissions: string[] } | null, item: NavItem): boolean {
  if (!user) return false;
  if (user.role === "super_admin") return true;
  if (item.requiredPermission) {
    return user.permissions.includes(item.requiredPermission);
  }
  if (item.roles) {
    return item.roles.includes(user.role);
  }
  return true;
}

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
  const user = useAuthStore((s) => s.user);

  const filteredNavItems = useMemo(
    () => navItems.filter((item) => hasPermission(user, item)),
    [navItems, user],
  );

  const roleTitleLabels: Record<string, string> = {
    super_admin: "Super Admin's CRM",
    admin: "Admin CRM",
    staff: "Staff Dashboard",
    finance: "Finance Dashboard",
    support: "Support Hub",
    seo: "SEO Dashboard",
    design: "Design Dashboard",
    content: "Content Dashboard",
    hr: "HR Dashboard",
    operations: "Operations Dashboard",
    crm_ops: "CRM Ops Dashboard",
    client: "Client Portal",
  };

  const roleSubtitleLabels: Record<string, string> = {
    super_admin: "Operational command center with full access across sales, service delivery, CMS, finance, and client management.",
    admin: "Operational command center covering sales, service delivery, CMS, and finance.",
    client: "Dashboard, projects, files, billing, and support.",
  };

  const roleTitle = user ? (roleTitleLabels[user.role] ?? title) : title;
  const roleSubtitle = user ? (roleSubtitleLabels[user.role] ?? subtitle) : subtitle;

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/portal") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const activeItem = filteredNavItems.find((item) => isActive(item.href));
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
            <p className="eyebrow">{user?.name ?? "Workspace"}</p>
            <h2>{roleTitle}</h2>
            <p className="muted">{roleSubtitle}</p>
          </div>
        </div>
        <nav className="dashboard-nav">
          {filteredNavItems.map((item) => (
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
            <p className="eyebrow">{user?.name ?? "User"}</p>
            <strong>{activeItem?.label ?? roleTitle}</strong>
          </div>
          <button type="button" className="dashboard-logout-icon" aria-label="Logout" title="Logout" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
        <div className="dashboard-topbar glass">
          <div className="dashboard-topbar-section">
            <p className="eyebrow">{user?.name ?? "User"}</p>
            <strong>{activeItem?.label ?? roleTitle}</strong>
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
        <div className="dashboard-content glass">
          <h1 className="page-heading">{activeItem?.label ?? roleTitle}</h1>
          {children}
        </div>
      </main>
    </div>
  );
}
