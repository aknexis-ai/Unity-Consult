"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { liveApi } from "@/lib/api/resources";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const query = useQuery({ queryKey: ["orders", params.id], queryFn: () => liveApi.order(params.id) });

  if (query.isLoading) return <section className="card">Loading order...</section>;
  if (query.error) return <section className="card error-card">{query.error.message}</section>;
  if (!query.data) return <section className="card">Order not found.</section>;

  const order = query.data;

  return (
    <section className="card">
      <p className="eyebrow">{order.status}</p>
      <h3>{order.clientName}</h3>
      <ul className="detail-list">
        <li>Service: {order.serviceName}</li>
        <li>Stage: {order.stage}</li>
        <li>Owner: {order.owner ?? "Unassigned"}</li>
      </ul>
    </section>
  );
}
