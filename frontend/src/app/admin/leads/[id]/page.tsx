"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { liveApi } from "@/lib/api/resources";

export default function AdminLeadDetailPage() {
  const params = useParams<{ id: string }>();
  const query = useQuery({ queryKey: ["leads", params.id], queryFn: () => liveApi.lead(params.id) });

  if (query.isLoading) return <section className="card">Loading lead...</section>;
  if (query.error) return <section className="card error-card">{query.error.message}</section>;
  if (!query.data) return <section className="card">Lead not found.</section>;

  const lead = query.data;

  return (
    <section className="card">
      <p className="eyebrow">{lead.stage}</p>
      <h3>{lead.name}</h3>
      <ul className="detail-list">
        <li>Email: {lead.email}</li>
        <li>Company: {lead.company ?? "Not provided"}</li>
        <li>Service: {lead.service}</li>
        <li>Source: {lead.source ?? "Not provided"}</li>
        <li>Budget: {lead.budget ?? "Not provided"}</li>
      </ul>
    </section>
  );
}
