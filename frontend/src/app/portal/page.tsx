"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Metric, Project } from "@/lib/api/types";

export default function PortalPage() {
  const metricsQuery = useQuery({ queryKey: ["analytics", "portal"], queryFn: liveApi.portalMetrics });
  const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: liveApi.projects });

  return (
    <div className="stack-lg">
      <QueryState<Metric>
        data={metricsQuery.data}
        isLoading={metricsQuery.isLoading}
        error={metricsQuery.error}
        emptyMessage="No portal metrics are available yet."
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
      <QueryState<Project>
        data={projectsQuery.data}
        isLoading={projectsQuery.isLoading}
        error={projectsQuery.error}
        emptyMessage="No projects found yet. Run the seed command or create a project from admin."
      >
        {(projects) => (
          <section className="card">
            <h3>Current projects</h3>
            <div className="table-shell">
              <table>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Milestone</th>
                    <th>Due date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td data-label="Project">
                        <Link href={`/portal/projects/${project._id}`}>{project.name}</Link>
                      </td>
                      <td data-label="Service">{project.serviceName}</td>
                      <td data-label="Status">{project.status}</td>
                      <td data-label="Milestone">{project.milestone}</td>
                      <td data-label="Due date">{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Not set"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </QueryState>
    </div>
  );
}
