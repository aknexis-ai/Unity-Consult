import { AuthGate } from "@/components/auth-gate";
import { DashboardShell } from "@/components/dashboard-shell";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/finance", label: "Finance" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/tickets", label: "Tickets" },
  { href: "/admin/audit", label: "Audit" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate roles={["admin", "staff"]}>
      <DashboardShell
        title="Admin CRM"
        subtitle="Operational command center covering sales, service delivery, CMS, and finance."
        navItems={navItems}
      >
        {children}
      </DashboardShell>
    </AuthGate>
  );
}
