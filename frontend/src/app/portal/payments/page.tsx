"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Invoice } from "@/lib/api/types";

export default function PortalPaymentsPage() {
  const query = useQuery({ queryKey: ["invoices", "payments"], queryFn: liveApi.invoices });

  return (
    <QueryState<Invoice>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      emptyMessage="No payment records found yet."
    >
      {(invoices) => {
        const payableInvoices = invoices.filter((invoice) => invoice.amount > invoice.amountPaid);

        return (
          <section className="card stack">
            <div>
              <p className="eyebrow">Payments</p>
              <h3>Payment center</h3>
              <p className="muted">
                Review outstanding invoices and start Razorpay checkout from the invoice detail page.
              </p>
            </div>
            {payableInvoices.length === 0 ? (
              <p>All visible invoices are fully paid.</p>
            ) : (
              <div className="card-grid">
                {payableInvoices.map((invoice) => {
                  const remaining = invoice.amount - invoice.amountPaid;

                  return (
                    <article key={invoice._id} className="card inset-card">
                      <p className="eyebrow">{invoice.status}</p>
                      <h4>{invoice.invoiceNumber}</h4>
                      <p>{invoice.serviceName}</p>
                      <ul className="detail-list">
                        <li>Total: Rs {invoice.amount.toLocaleString("en-IN")}</li>
                        <li>Paid: Rs {invoice.amountPaid.toLocaleString("en-IN")}</li>
                        <li>Remaining: Rs {remaining.toLocaleString("en-IN")}</li>
                      </ul>
                      <Link href={`/portal/payments/${invoice._id}`} className="primary-button">
                        Pay now
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      }}
    </QueryState>
  );
}
