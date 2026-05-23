"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { DocumentRecord } from "@/lib/api/types";

function resolveDocumentUrl(fileUrl: string) {
  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  const apiRoot = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "http://127.0.0.1:4000";

  return `${apiRoot}${fileUrl}`;
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PortalDocumentsPage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const query = useQuery({ queryKey: ["documents"], queryFn: liveApi.documents });
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("Choose a document before uploading.");
      }

      const base64Data = await toBase64(file);

      return liveApi.uploadDocument({
        name: file.name,
        ownerName: "Client upload",
        category: "other",
        description,
        mimeType: file.type || "application/octet-stream",
        data: base64Data,
      });
    },
    onSuccess: async () => {
      setFile(null);
      setDescription("");
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return (
    <div className="stack">
      <section className="card">
        <h3>Upload document</h3>
        <div className="form-grid">
          <label>
            File
            <input type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </label>
          <label>
            Description
            <input
              placeholder="Contract, brief, approval note, or deliverable context"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          className="primary-button"
          disabled={!file || uploadMutation.isPending}
          onClick={() => uploadMutation.mutate()}
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload document"}
        </button>
        {uploadMutation.error ? <p className="field-error">{uploadMutation.error.message}</p> : null}
        {uploadMutation.data ? <p>Document uploaded successfully.</p> : null}
      </section>
      <QueryState<DocumentRecord>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        emptyMessage="No documents found yet."
      >
        {(documents) => (
          <section className="card">
            <h3>Document hub</h3>
            <div className="table-shell">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((item) => (
                    <tr key={item._id}>
                      <td data-label="Name">
                        <a href={resolveDocumentUrl(item.fileUrl)}>{item.name}</a>
                      </td>
                      <td data-label="Category">{item.category}</td>
                      <td data-label="Owner">{item.ownerName}</td>
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
