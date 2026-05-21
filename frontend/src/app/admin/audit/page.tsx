"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { AuditLog } from "@/lib/api/types";

function formatMetadata(metadata?: Record<string, unknown>) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return "No metadata";
  }

  return Object.entries(metadata)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(" | ");
}

export default function AdminAuditPage() {
  const query = useQuery({ queryKey: ["audit-logs"], queryFn: liveApi.auditLogs });

  return (
    <QueryState<AuditLog>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      emptyMessage="No audit events have been recorded yet."
    >
      {(logs) => (
        <section className="card">
          <h3>Audit trail</h3>
          <p>Security-sensitive admin and payment actions are recorded here for review.</p>
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Actor</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td data-label="Time">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "Just now"}</td>
                    <td data-label="Action">{log.action}</td>
                    <td data-label="Entity">
                      {log.entityType}
                      {log.entityId ? ` / ${log.entityId}` : ""}
                    </td>
                    <td data-label="Actor">{log.actorRole ?? "system"}</td>
                    <td data-label="Details">{formatMetadata(log.metadata)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </QueryState>
  );
}
