"use client";

import React, { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function TransactionsPage() {
  const { orders, loading, error } = useOrders();
  const queryClient = useQueryClient();
  const statusMutation = useMutation<Response, Error, { id: number; status: string }>({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
  const handleStatusChange = (id: number, status: string) => {
    statusMutation.mutate({ id, status });
  };
  const [openRow, setOpenRow] = useState<number | null>(null);

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
                <td
                  className="px-4 py-2 relative cursor-pointer"
                  onClick={() => setOpenRow(openRow === order.id ? null : order.id)}
                >
                  <span>{order.status}</span>
                  {openRow === order.id && (
                    <div className="absolute z-10 mt-1 bg-white border rounded shadow-lg">
                      {['pending', 'success', 'cancelled']
                        .filter(s => s !== order.status)
                        .map(s => (
                          <button
                            key={s}
                            className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                            onClick={() => {
                              handleStatusChange(order.id, s);
                              setOpenRow(null);
                            }}
                          >
                            {s}
                          </button>
                        ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 