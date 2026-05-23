import { AuthGate } from "@/components/auth-gate";
import { DashboardShell } from "@/components/dashboard-shell";

const navItems = [
  { href: "/admin", label: "Dashboard", requiredPermission: "dashboard" },
  { href: "/admin/leads", label: "Leads", requiredPermission: "leads" },
  { href: "/admin/orders", label: "Orders", requiredPermission: "orders" },
  { href: "/admin/services", label: "Services", requiredPermission: "services" },
  { href: "/admin/content", label: "Content", requiredPermission: "content" },
  { href: "/admin/finance", label: "Finance", requiredPermission: "finance" },
  { href: "/admin/team", label: "Team", requiredPermission: "team" },
  { href: "/admin/support", label: "Support", requiredPermission: "support" },
  { href: "/admin/tickets", label: "Tickets", requiredPermission: "tickets" },
  { href: "/admin/audit", label: "Audit", requiredPermission: "audit" },
  { href: "/admin/messages", label: "Messages", requiredPermission: "messages" },
  { href: "/admin/users", label: "Users", requiredPermission: "users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate roles={["super_admin", "admin", "staff", "finance", "support", "seo", "design", "content", "hr", "operations", "crm_ops"]}>
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
