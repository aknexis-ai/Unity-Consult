"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { ContentItem } from "@/lib/api/types";

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminContentPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("page");
  const [status, setStatus] = useState("draft");
  const [summary, setSummary] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const query = useQuery({ queryKey: ["content"], queryFn: liveApi.content });

  const createMutation = useMutation({
    mutationFn: async () => {
      let imageData: string | undefined;
      let imageMimeType: string | undefined;
      let imageName: string | undefined;

      if (imageFile) {
        imageData = await toBase64(imageFile);
        imageMimeType = imageFile.type;
        imageName = imageFile.name;
      }

      return liveApi.createContent({ title, type, status, summary, imageData, imageMimeType, imageName } as Partial<ContentItem>);
    },
    onSuccess: async () => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      let imageData: string | undefined;
      let imageMimeType: string | undefined;
      let imageName: string | undefined;

      if (imageFile) {
        imageData = await toBase64(imageFile);
        imageMimeType = imageFile.type;
        imageName = imageFile.name;
      }

      return liveApi.updateContent(editingId!, { title, type, status, summary, imageData, imageMimeType, imageName } as Partial<ContentItem>);
    },
    onSuccess: async () => {
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => liveApi.deleteContent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  const resetForm = () => {
    setTitle("");
    setType("page");
    setStatus("draft");
    setSummary("");
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const startEdit = (item: ContentItem) => {
    setTitle(item.title);
    setType(item.type);
    setStatus(item.status);
    setSummary(item.summary ?? "");
    setImagePreview(item.imageUrl ?? null);
    setEditingId(item._id);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="stack-lg">
      <section className="card">
        <h3>{editingId ? "Edit content item" : "Content operations"}</h3>
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
          <label className="span-2">
            Cover image
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div style={{ marginTop: 8, position: "relative", maxWidth: 300, borderRadius: 8, overflow: "hidden" }}>
                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            )}
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="primary-button" type="button" disabled={isPending} onClick={() => (editingId ? updateMutation.mutate() : createMutation.mutate())}>
            {editingId ? "Update content item" : "Create content item"}
          </button>
          {editingId && (
            <button className="ghost-button" type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
        {createMutation.error ? <p className="field-error">{createMutation.error.message}</p> : null}
        {updateMutation.error ? <p className="field-error">{updateMutation.error.message}</p> : null}
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
                  {item.imageUrl && (
                    <div style={{ borderRadius: 6, overflow: "hidden", marginBottom: 8, maxHeight: 160 }}>
                      <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "auto", display: "block" }} />
                    </div>
                  )}
                  <p className="eyebrow">{item.type}</p>
                  <h4>{item.title}</h4>
                  <p>{item.summary}</p>
                  <small>{item.status}</small>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() => deleteMutation.mutate(item._id)}
                      disabled={deleteMutation.isPending}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </QueryState>
    </div>
  );
}
