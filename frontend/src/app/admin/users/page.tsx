"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { ApiUser } from "@/lib/api/types";

const ALL_PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "leads", label: "Leads" },
  { key: "orders", label: "Orders" },
  { key: "services", label: "Services" },
  { key: "content", label: "Content" },
  { key: "finance", label: "Finance" },
  { key: "team", label: "Team" },
  { key: "support", label: "Support" },
  { key: "tickets", label: "Tickets" },
  { key: "audit", label: "Audit" },
  { key: "users", label: "Users" },
  { key: "permissions", label: "Permissions" },
  { key: "settings", label: "Settings" },
  { key: "messages", label: "Messages" },
  { key: "documents", label: "Documents" },
  { key: "projects", label: "Projects" },
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments" },
];

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff",
  finance: "Finance",
  support: "Support",
  seo: "SEO",
  design: "Design",
  content: "Content",
  hr: "HR",
  operations: "Operations",
  crm_ops: "CRM Ops",
  client: "Client",
};

function hasPermission(user: ApiUser, permKey: string): boolean {
  return user.permissions?.includes(permKey) ?? false;
}

export default function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = currentUser?.role === "super_admin";
  const queryClient = useQueryClient();
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const updatePermissions = useMutation({
    mutationFn: ({ id, permissions }: { id: string; permissions: string[] }) =>
      liveApi.updateUserPermissions(id, permissions),
    onMutate: async ({ id, permissions }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "users"] });
      const previousData = queryClient.getQueryData<ApiUser[]>(["admin", "users"]);
      queryClient.setQueryData<ApiUser[]>(["admin", "users"], (old) =>
        old?.map((u) => (u.id === id ? { ...u, permissions } : u)),
      );
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["admin", "users"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const query = useQuery({ queryKey: ["admin", "users"], queryFn: liveApi.users });

  const togglePermission = (user: ApiUser, permKey: string) => {
    const current = user.permissions ?? [];
    const next = current.includes(permKey)
      ? current.filter((p) => p !== permKey)
      : [...current, permKey];
    updatePermissions.mutate({ id: user.id, permissions: next });
  };

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="user-mgmt-header">
          <h3>User Management</h3>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-mgmt-search"
          />
        </div>
        <QueryState<ApiUser>
          data={query.data}
          isLoading={query.isLoading}
          error={query.error}
          emptyMessage="No users found."
        >
          {(users) => {
            const filtered = searchQuery
              ? users.filter((u) =>
                  u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchQuery.toLowerCase()),
                )
              : users;

            return (
              <div className="table-shell">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Permissions</th>
                      {isSuperAdmin && <th className="actions-col">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user) => {
                      const isExpanded = expandedUserId === user.id;
                      const isUpdating = updatePermissions.isPending &&
                        updatePermissions.variables?.id === user.id;
                      const isSelf = user.id === currentUser?.id;

                      return (
                        <tr key={user.id}>
                          <td className="user-cell" data-label="User">
                            <strong>{user.name}</strong>
                            <p className="muted">{user.email}</p>
                          </td>
                          <td className="badge-cell" data-label="Role">
                            <span className={`badge role-${user.role}`}>
                              {ROLE_LABELS[user.role] ?? user.role}
                            </span>
                          </td>
                          <td className="perms-cell" data-label="Permissions">
                            {isExpanded && isSuperAdmin && !isSelf ? (
                              <div className="perms-grid">
                                {ALL_PERMISSIONS.map((perm) => {
                                  const hasIt = hasPermission(user, perm.key);
                                  return (
                                    <label
                                      key={perm.key}
                                      className={`perm-chip ${hasIt ? "granted" : ""} ${isUpdating ? "updating" : ""}`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={hasIt}
                                        disabled={isUpdating}
                                        onChange={() => togglePermission(user, perm.key)}
                                      />
                                      {perm.label}
                                    </label>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="perms-summary">
                                {user.permissions?.length ?? 0} / {ALL_PERMISSIONS.length} granted
                              </span>
                            )}
                          </td>
                          {isSuperAdmin && (
                            <td className="actions-cell" data-label="Actions">
                              {isSelf ? (
                                <span className="muted">Current user</span>
                              ) : (
                                <button
                                  type="button"
                                  className="ghost-button"
                                  onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                                >
                                  {isExpanded ? "Collapse" : "Assign permissions"}
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }}
        </QueryState>
      </section>
    </div>
  );
}
