"use client";

import React from "react";
import { useOrders } from "@/hooks/useOrders";

export default function TransactionsPage() {
  const { orders, loading, error } = useOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Recent Transactions</h1>
      {error && <div className="text-red-500 mb-2">Error: {error}</div>}
      {loading && <div>Loading...</div>}

      <div className="overflow-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
                <td className="px-4 py-2">{order.customer_name}</td>
                <td className="px-4 py-2 text-right">${order.total_amount.toFixed(2)}</td>
                <td className="px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 