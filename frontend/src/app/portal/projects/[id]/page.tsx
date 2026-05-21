"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { liveApi } from "@/lib/api/resources";

export default function PortalProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const query = useQuery({ queryKey: ["projects", params.id], queryFn: () => liveApi.project(params.id) });

  if (query.isLoading) return <section className="card">Loading project...</section>;
  if (query.error) return <section className="card error-card">{query.error.message}</section>;
  if (!query.data) return <section className="card">Project not found.</section>;

  const project = query.data;

  return (
    <section className="card">
      <p className="eyebrow">{project.status}</p>
      <h3>{project.name}</h3>
      <ul className="detail-list">
        <li>Client: {project.clientName}</li>
        <li>Service: {project.serviceName}</li>
        <li>Milestone: {project.milestone}</li>
        <li>Due date: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Not set"}</li>
      </ul>
      <h4>Deliverables</h4>
      <ul className="detail-list">
        {project.deliverables.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
