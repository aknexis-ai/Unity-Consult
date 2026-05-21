"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { PortalMessage } from "@/lib/api/types";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function PortalMessagesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState("");
  const query = useQuery({ queryKey: ["messages"], queryFn: liveApi.messages });
  const mutation = useMutation({
    mutationFn: () =>
      liveApi.createMessage({
        fromName: user?.name ?? "Portal User",
        role: user?.role ?? "client",
        channel: "portal",
        toName: "Unity Consult Team",
        message,
      }),
    onSuccess: async () => {
      setMessage("");
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  return (
    <div className="stack-lg">
      <section className="card">
        <h3>Send a message</h3>
        <div className="form-grid">
          <label className="span-2">
            Message
            <textarea
              rows={4}
              placeholder="Share updates, questions, or approval notes with the delivery team."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
        </div>
        <button className="primary-button" type="button" onClick={() => mutation.mutate()} disabled={!message.trim()}>
          Send message
        </button>
        {mutation.error ? <p className="field-error">{mutation.error.message}</p> : null}
      </section>
      <QueryState<PortalMessage>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        emptyMessage="No messages found yet."
      >
        {(messages) => (
          <section className="card">
            <h3>Messages</h3>
            <div className="stack">
              {messages.map((item) => (
                <article key={item._id} className="card inset-card">
                  <div className="message-header">
                    <strong>{item.fromName}</strong>
                    <span>{item.role}</span>
                    <small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "Live record"}</small>
                  </div>
                  <p>{item.message}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </QueryState>
    </div>
  );
}
