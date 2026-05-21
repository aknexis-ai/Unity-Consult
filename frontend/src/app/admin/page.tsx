"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Metric } from "@/lib/api/types";

export default function AdminPage() {
  const query = useQuery({ queryKey: ["analytics", "admin"], queryFn: liveApi.adminMetrics });

  return (
    <div className="stack-lg">
      <QueryState<Metric>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        emptyMessage="No admin metrics are available yet."
      >
        {(metrics) => (
          <div className="metric-board">
            {metrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                <small>{metric.detail}</small>
              </article>
            ))}
          </div>
        )}
      </QueryState>
      <section className="card">
        <h3>Operations snapshot</h3>
        <p>Live admin workspace is connected to backend metrics, records, and provider health.</p>
      </section>
    </div>
  );
}
