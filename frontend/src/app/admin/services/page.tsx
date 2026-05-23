"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { ServiceCatalogItem } from "@/lib/api/types";

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

export default function AdminServicesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Technology");
  const [priceFrom, setPriceFrom] = useState("");
  const [delivery, setDelivery] = useState("");
  const [short, setShort] = useState("");
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [cardFile, setCardFile] = useState<File | null>(null);
  const [cardPreview, setCardPreview] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const query = useQuery({ queryKey: ["services", "catalog"], queryFn: liveApi.servicesCatalog });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        name, slug, category, short,
        description: short,
        priceFrom, delivery,
        outcomes: [], workflow: [], bookingFields: [], related: [],
        status: "active",
      };

      if (heroFile) { payload.heroImageData = await toBase64(heroFile); payload.heroImageMimeType = heroFile.type; payload.heroImageName = heroFile.name; }
      if (cardFile) { payload.cardImageData = await toBase64(cardFile); payload.cardImageMimeType = cardFile.type; payload.cardImageName = cardFile.name; }

      return liveApi.createServiceCatalog(payload as Partial<ServiceCatalogItem>);
    },
    onSuccess: async () => { resetForm(); await queryClient.invalidateQueries({ queryKey: ["services", "catalog"] }); },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = { name, category, short, description: short, priceFrom, delivery };
      if (heroFile) { payload.heroImageData = await toBase64(heroFile); payload.heroImageMimeType = heroFile.type; payload.heroImageName = heroFile.name; }
      if (cardFile) { payload.cardImageData = await toBase64(cardFile); payload.cardImageMimeType = cardFile.type; payload.cardImageName = cardFile.name; }
      return liveApi.updateServiceCatalog(editingSlug!, payload as Partial<ServiceCatalogItem>);
    },
    onSuccess: async () => { resetForm(); await queryClient.invalidateQueries({ queryKey: ["services", "catalog"] }); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ serviceSlug, status }: { serviceSlug: string; status: string }) =>
      liveApi.updateServiceCatalog(serviceSlug, { status }),
    onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["services", "catalog"] }); },
  });

  const resetForm = () => {
    setName(""); setSlug(""); setCategory("Technology"); setPriceFrom(""); setDelivery(""); setShort("");
    setHeroFile(null); setHeroPreview(null); setCardFile(null); setCardPreview(null);
    setEditingSlug(null);
  };

  const startEdit = (service: ServiceCatalogItem) => {
    setName(service.name); setSlug(service.slug); setCategory(service.category);
    setPriceFrom(service.priceFrom ?? ""); setDelivery(service.delivery ?? ""); setShort(service.short ?? "");
    const media = (service.media ?? {}) as Record<string, string>;
    setHeroPreview(media.hero ?? null); setCardPreview(media.card ?? null);
    setEditingSlug(service.slug);
  };

  const handleHeroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setHeroFile(file);
    if (file) { const r = new FileReader(); r.onload = () => setHeroPreview(r.result as string); r.readAsDataURL(file); }
    else { setHeroPreview(null); }
  };

  const handleCardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCardFile(file);
    if (file) { const r = new FileReader(); r.onload = () => setCardPreview(r.result as string); r.readAsDataURL(file); }
    else { setCardPreview(null); }
  };

  return (
    <div className="stack-lg">
      <section className="card">
        <h3>{editingSlug ? "Edit service" : "Service catalog"}</h3>
        <div className="form-grid">
          <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Web Development" /></label>
          <label>Slug<input value={slug} disabled={!!editingSlug} onChange={(e) => setSlug(e.target.value)} placeholder="web-development" /></label>
          <label>Category<input value={category} onChange={(e) => setCategory(e.target.value)} /></label>
          <label>Starting price<input value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="Rs 99,999" /></label>
          <label>Delivery<input value={delivery} onChange={(e) => setDelivery(e.target.value)} placeholder="4-10 weeks" /></label>
          <label className="span-2">
            Summary<textarea value={short} rows={3} onChange={(e) => setShort(e.target.value)} />
          </label>
          <label>
            Hero image<input type="file" accept="image/*" onChange={handleHeroChange} />
            {heroPreview && <img src={heroPreview} alt="Hero preview" style={{ maxWidth: "100%", maxHeight: 120, marginTop: 8, borderRadius: 6 }} />}
          </label>
          <label>
            Card image<input type="file" accept="image/*" onChange={handleCardChange} />
            {cardPreview && <img src={cardPreview} alt="Card preview" style={{ maxWidth: "100%", maxHeight: 120, marginTop: 8, borderRadius: 6 }} />}
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="primary-button" disabled={createMutation.isPending || updateMutation.isPending}
            onClick={() => editingSlug ? updateMutation.mutate() : createMutation.mutate()}>
            {editingSlug ? "Update service" : "Create service"}
          </button>
          {editingSlug && <button type="button" className="ghost-button" onClick={resetForm}>Cancel</button>}
        </div>
        {createMutation.error ? <p className="field-error">{createMutation.error.message}</p> : null}
      </section>
      <QueryState<ServiceCatalogItem> data={query.data} isLoading={query.isLoading} error={query.error} emptyMessage="No services found yet.">
        {(items) => (
          <section className="card">
            <div className="card-grid">
              {items.map((service) => {
                const media = (service.media ?? {}) as Record<string, string>;
                return (
                  <article key={service.slug} className="card inset-card">
                    {media.card && <img src={media.card} alt={service.name} style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} />}
                    <div className="card-topline">{service.category}</div>
                    <h4>{service.name}</h4>
                    <p>{service.short}</p>
                    <ul className="detail-list">
                      <li>Price: {service.priceFrom}</li>
                      <li>Delivery: {service.delivery}</li>
                      <li>Status: {service.status}</li>
                    </ul>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="ghost-button" onClick={() => startEdit(service)}>Edit</button>
                      <button type="button" className="ghost-button"
                        onClick={() => statusMutation.mutate({ serviceSlug: service.slug, status: service.status === "active" ? "paused" : "active" })}>
                        {service.status === "active" ? "Pause" : "Activate"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </QueryState>
    </div>
  );
}
