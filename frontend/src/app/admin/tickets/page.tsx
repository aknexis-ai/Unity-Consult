"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Ticket } from "@/lib/api/types";

export default function AdminTicketsPage() {
  const query = useQuery({ queryKey: ["tickets"], queryFn: liveApi.tickets });

  return (
    <QueryState<Ticket>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      emptyMessage="No tickets found yet."
    >
      {(tickets) => (
        <section className="card">
          <h3>Support ticket board</h3>
          <div className="card-grid">
            {tickets.map((ticket) => (
              <article key={ticket._id} className="card inset-card">
                <h4>{ticket.subject}</h4>
                <ul className="detail-list">
                  <li>Priority: {ticket.priority}</li>
                  <li>Status: {ticket.status}</li>
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </QueryState>
  );
}
