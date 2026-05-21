"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { ContentItem } from "@/lib/api/types";

export default function AdminContentPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("page");
  const [status, setStatus] = useState("draft");
  const [summary, setSummary] = useState("");
  const query = useQuery({ queryKey: ["content"], queryFn: liveApi.content });
  const createMutation = useMutation({
    mutationFn: () => liveApi.createContent({ title, type, status, summary }),
    onSuccess: async () => {
      setTitle("");
      setType("page");
      setStatus("draft");
      setSummary("");
      await queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => liveApi.deleteContent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  return (
    <div className="stack-lg">
      <section className="card">
        <h3>Content operations</h3>
        <div className="form-grid">
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Homepage hero section" />
          </label>
          <label>
            Type
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="page">Page</option>
              <option value="blog">Blog</option>
              <option value="portfolio">Portfolio</option>
              <option value="legal">Legal</option>
            </select>
          </label>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="span-2">
            Summary
            <textarea
              value={summary}
              rows={4}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Short editorial summary or publishing note."
            />
          </label>
        </div>
        <button className="primary-button" type="button" onClick={() => createMutation.mutate()}>
          Create content item
        </button>
        {createMutation.error ? <p className="field-error">{createMutation.error.message}</p> : null}
      </section>
      <QueryState<ContentItem>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        emptyMessage="No content items found yet."
      >
        {(items) => (
          <section className="card">
            <div className="card-grid">
              {items.map((item) => (
                <article key={item._id} className="card inset-card">
                  <p className="eyebrow">{item.type}</p>
                  <h4>{item.title}</h4>
                  <p>{item.summary}</p>
                  <small>{item.status}</small>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => deleteMutation.mutate(item._id)}
                    disabled={deleteMutation.isPending}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </QueryState>
    </div>
  );
}
