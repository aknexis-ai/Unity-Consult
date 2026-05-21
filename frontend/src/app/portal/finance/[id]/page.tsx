"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import { liveApi } from "@/lib/api/resources";

export default function PortalInvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const query = useQuery({ queryKey: ["invoices", params.id], queryFn: () => liveApi.invoice(params.id) });
  const paymentMutation = useMutation({
    mutationFn: () => {
      if (!query.data) throw new Error("Invoice is not loaded.");
      return liveApi.createPaymentOrder({ invoiceId: query.data._id, amount: query.data.amount - query.data.amountPaid });
    },
  });

  if (query.isLoading) return <section className="card">Loading invoice...</section>;
  if (query.error) return <section className="card error-card">{query.error.message}</section>;
  if (!query.data) return <section className="card">Invoice not found.</section>;

  const invoice = query.data;

  return (
    <section className="card">
      <p className="eyebrow">{invoice.status}</p>
      <h3>{invoice.invoiceNumber}</h3>
      <ul className="detail-list">
        <li>Client: {invoice.clientName}</li>
        <li>Service: {invoice.serviceName}</li>
        <li>Amount: Rs {invoice.amount.toLocaleString("en-IN")}</li>
        <li>Paid: Rs {invoice.amountPaid.toLocaleString("en-IN")}</li>
      </ul>
      <button className="primary-button" type="button" onClick={() => paymentMutation.mutate()}>
        Pay remaining
      </button>
      {paymentMutation.error ? <p className="field-error">{paymentMutation.error.message}</p> : null}
      {paymentMutation.data ? <p>Razorpay order created. Checkout UI can now open with your public key.</p> : null}
    </section>
  );
}
