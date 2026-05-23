import { AuthGate } from "@/components/auth-gate";
import { DashboardShell } from "@/components/dashboard-shell";

const navItems = [
  { href: "/portal", label: "Dashboard", requiredPermission: "dashboard" },
  { href: "/portal/projects", label: "Projects", requiredPermission: "projects" },
  { href: "/portal/documents", label: "Documents", requiredPermission: "documents" },
  { href: "/portal/invoices", label: "Invoices", requiredPermission: "invoices" },
  { href: "/portal/payments", label: "Payments", requiredPermission: "payments" },
  { href: "/portal/finance", label: "Finance", requiredPermission: "finance" },
  { href: "/portal/messages", label: "Messages", requiredPermission: "messages" },
  { href: "/portal/settings", label: "Settings", requiredPermission: "settings" },
  { href: "/portal/support", label: "Support", requiredPermission: "support" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate roles={["admin", "staff", "client"]}>
      <DashboardShell
        title="Client Portal"
        subtitle="Dashboard, projects, files, billing, and support."
        navItems={navItems}
      >
        {children}
      </DashboardShell>
    </AuthGate>
  );
}
