import { AuthGate } from "@/components/auth-gate";
import { DashboardShell } from "@/components/dashboard-shell";

const navItems = [
  { href: "/portal", label: "Dashboard" },
  { href: "/portal/projects", label: "Projects" },
  { href: "/portal/documents", label: "Documents" },
  { href: "/portal/invoices", label: "Invoices" },
  { href: "/portal/payments", label: "Payments" },
  { href: "/portal/finance", label: "Finance" },
  { href: "/portal/messages", label: "Messages" },
  { href: "/portal/settings", label: "Settings" },
  { href: "/portal/support", label: "Support" },
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
