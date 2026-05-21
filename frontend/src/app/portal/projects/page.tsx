"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Project } from "@/lib/api/types";

export default function PortalProjectsPage() {
  const query = useQuery({ queryKey: ["projects"], queryFn: liveApi.projects });

  return (
    <QueryState<Project>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      emptyMessage="No projects found yet."
    >
      {(projects) => (
        <section className="card">
          <h3>Project tracking</h3>
          <div className="card-grid">
            {projects.map((project) => (
              <article key={project._id} className="card inset-card">
                <h4>{project.name}</h4>
                <p>{project.serviceName}</p>
                <ul className="detail-list">
                  <li>Status: {project.status}</li>
                  <li>Milestone: {project.milestone}</li>
                  <li>Due date: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Not set"}</li>
                </ul>
                <Link href={`/portal/projects/${project._id}`} className="inline-link">
                  View project
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </QueryState>
  );
}
