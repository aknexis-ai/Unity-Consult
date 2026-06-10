"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Order } from "@/lib/api/types";

export default function AdminOrdersPage() {
  const query = useQuery({ queryKey: ["orders"], queryFn: liveApi.orders });

  return (
    <QueryState<Order>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      emptyMessage="No orders found yet. Run the seed command or create an order from a won lead."
    >
      {(orders) => (
        <section className="card">
          <h3>Order and project management</h3>
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Stage</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td data-label="Order">
                      <Link href={`/admin/orders/${order._id}`}>ORD-{order._id.slice(-6).toUpperCase()}</Link>
                    </td>
                    <td data-label="Client">{order.clientName}</td>
                    <td data-label="Service">{order.serviceName}</td>
                    <td data-label="Stage">{order.stage}</td>
                    <td data-label="Owner">{order.owner ?? "Unassigned"}</td>
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
