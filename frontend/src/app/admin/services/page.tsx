"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { ServiceCatalogItem } from "@/lib/api/types";

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Technology");
  const [priceFrom, setPriceFrom] = useState("");
  const [delivery, setDelivery] = useState("");
  const [short, setShort] = useState("");
  const query = useQuery({ queryKey: ["services", "catalog"], queryFn: liveApi.servicesCatalog });
  const createMutation = useMutation({
    mutationFn: () =>
      liveApi.createServiceCatalog({
        name,
        slug,
        category,
        short,
        description: short,
        priceFrom,
        delivery,
        outcomes: [],
        workflow: [],
        bookingFields: [],
        related: [],
        status: "active",
      }),
    onSuccess: async () => {
      setName("");
      setSlug("");
      setCategory("Technology");
      setPriceFrom("");
      setDelivery("");
      setShort("");
      await queryClient.invalidateQueries({ queryKey: ["services", "catalog"] });
    },
  });
  const statusMutation = useMutation({
    mutationFn: ({ serviceSlug, status }: { serviceSlug: string; status: string }) =>
      liveApi.updateServiceCatalog(serviceSlug, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services", "catalog"] });
    },
  });

  return (
    <div className="stack-lg">
      <section className="card">
        <h3>Service catalog</h3>
        <div className="form-grid">
          <label>
            Name
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Web Development" />
          </label>
          <label>
            Slug
            <input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="web-development" />
          </label>
          <label>
            Category
            <input value={category} onChange={(event) => setCategory(event.target.value)} />
          </label>
          <label>
            Starting price
            <input value={priceFrom} onChange={(event) => setPriceFrom(event.target.value)} placeholder="Rs 99,999" />
          </label>
          <label>
            Delivery
            <input value={delivery} onChange={(event) => setDelivery(event.target.value)} placeholder="4-10 weeks" />
          </label>
          <label className="span-2">
            Summary
            <textarea value={short} rows={3} onChange={(event) => setShort(event.target.value)} />
          </label>
        </div>
        <button type="button" className="primary-button" onClick={() => createMutation.mutate()}>
          Create service
        </button>
        {createMutation.error ? <p className="field-error">{createMutation.error.message}</p> : null}
      </section>
      <QueryState<ServiceCatalogItem>
        data={query.data}
        isLoading={query.isLoading}
        error={query.error}
        emptyMessage="No services found yet."
      >
        {(items) => (
          <section className="card">
            <div className="card-grid">
              {items.map((service) => (
                <article key={service.slug} className="card inset-card">
                  <div className="card-topline">{service.category}</div>
                  <h4>{service.name}</h4>
                  <p>{service.short}</p>
                  <ul className="detail-list">
                    <li>Price: {service.priceFrom}</li>
                    <li>Delivery: {service.delivery}</li>
                    <li>Status: {service.status}</li>
                  </ul>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() =>
                      statusMutation.mutate({
                        serviceSlug: service.slug,
                        status: service.status === "active" ? "paused" : "active",
                      })
                    }
                  >
                    {service.status === "active" ? "Pause" : "Activate"}
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
