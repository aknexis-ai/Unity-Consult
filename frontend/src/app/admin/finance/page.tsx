"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Invoice } from "@/lib/api/types";

export default function AdminFinancePage() {
  const query = useQuery({ queryKey: ["invoices"], queryFn: liveApi.invoices });

  return (
    <QueryState<Invoice>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      emptyMessage="No invoices found yet."
    >
      {(invoices) => (
        <section className="card">
          <h3>Finance and revenue</h3>
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td data-label="Invoice">{invoice.invoiceNumber}</td>
                    <td data-label="Service">{invoice.serviceName}</td>
                    <td data-label="Amount">Rs {invoice.amount.toLocaleString("en-IN")}</td>
                    <td data-label="Status">{invoice.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </QueryState>
  );
}
