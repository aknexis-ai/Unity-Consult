"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Ticket } from "@/lib/api/types";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function PortalSupportPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const query = useQuery({ queryKey: ["tickets"], queryFn: liveApi.tickets });
  const mutation = useMutation({
    mutationFn: () =>
      liveApi.createTicket({
        subject,
        message,
        requesterName: user?.name ?? "Client User",
        requesterEmail: user?.email ?? "client@unityconsult.local",
        priority: "medium",
      }),
    onSuccess: async () => {
      setSubject("");
      setMessage("");
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  return (
    <div className="stack-lg">
      <section className="card">
        <h3>Create support ticket</h3>
        <div className="form-grid">
          <label>
            Subject
            <input value={subject} onChange={(event) => setSubject(event.target.value)} />
          </label>
          <label className="span-2">
            Message
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} />
          </label>
        </div>
        <button className="primary-button" type="button" onClick={() => mutation.mutate()}>
          Submit ticket
        </button>
        {mutation.error ? <p className="field-error">{mutation.error.message}</p> : null}
      </section>
      <QueryState<Ticket>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        emptyMessage="No tickets found yet."
      >
        {(tickets) => (
          <section className="card">
            <h3>Support and revisions</h3>
            <div className="card-grid">
              {tickets.map((ticket) => (
                <article key={ticket._id} className="card inset-card">
                  <h4>{ticket.subject}</h4>
                  <p>{ticket.message}</p>
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
    </div>
  );
}
