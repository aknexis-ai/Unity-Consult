"use client";

import { useState } from "react";
import { BadgePercent, CheckCircle2, CreditCard, XCircle } from "lucide-react";

import { PricingTierCard } from "@/components/premium-visuals";
import type { PricingTier, Service } from "@/lib/services";

const comparisonRows = [
  ["Best for", "Launch", "Growth", "Enterprise"],
  ["Payment style", "Full or advance", "Milestone", "Custom billing"],
  ["Portal visibility", "Invoices", "Invoices + documents", "Full delivery workspace"],
  ["Support", "Standard", "Priority", "SLA-driven"],
  ["Razorpay-ready", "yes", "yes", "yes"],
  ["Dedicated SLA", "no", "partial", "yes"],
];

function annualizePrice(price: string) {
  const match = price.replace(/,/g, "").match(/Rs\s*(\d+)/i);

  if (!match || price.toLowerCase().includes("custom")) {
    return price;
  }

  const amount = Number(match[1]);
  const annual = Math.round(amount * 12 * 0.8);

  return `Rs ${annual.toLocaleString("en-IN")}/year`;
}

export function PricingInteractive({ services }: { services: Service[] }) {
  const [compare, setCompare] = useState(true);
  const [annual, setAnnual] = useState(false);
  const featuredTiers: PricingTier[] = services.flatMap((service) =>
    service.pricingTiers
      .filter((tier) => tier.highlighted)
      .map((tier) => ({
        ...tier,
        name: `${service.name}: ${tier.name}`,
        price: annual ? annualizePrice(tier.price) : tier.price,
      })),
  );
  const addons = services.flatMap((service) => service.addons.slice(0, 1).map((addon) => ({ ...addon, service: service.name })));

  return (
    <div className="stack-lg">
      <div className="pricing-control-row">
        <button type="button" className={`toggle-pill ${annual ? "active" : ""}`} onClick={() => setAnnual(!annual)}>
          <BadgePercent size={16} />
          {annual ? "Annual billing: 20% saved" : "Monthly / project pricing"}
        </button>
        <button type="button" className={`toggle-pill ${compare ? "active" : ""}`} onClick={() => setCompare(!compare)}>
          <CreditCard size={16} />
          {compare ? "Hide comparison" : "Show comparison"}
        </button>
      </div>

      <div className="pricing-tier-grid">
        {featuredTiers.map((tier) => (
          <PricingTierCard key={tier.name} tier={tier} />
        ))}
      </div>

      {compare ? (
        <div className="card comparison-table">
          {comparisonRows.map((row) => (
            <div key={row[0]} className="comparison-row">
              {row.map((cell, index) => (
                <span key={`${row[0]}-${index}`}>
                  {index > 0 && cell === "yes" ? <CheckCircle2 size={16} /> : null}
                  {index > 0 && cell === "no" ? <XCircle size={16} /> : null}
                  {cell === "yes" || cell === "no" ? "" : cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      <div className="card-grid">
        {addons.map((addon) => (
          <article key={`${addon.service}-${addon.name}`} className="card">
            <div className="card-topline">{addon.service}</div>
            <h3>{addon.name}</h3>
            <p>{addon.description}</p>
            <strong>{addon.price}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
