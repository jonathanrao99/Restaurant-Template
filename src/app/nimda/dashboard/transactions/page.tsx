"use client";

import React, { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useQueryClient, useMutation } from '@tanstack/react-query';

export default function TransactionsPage() {
  const { orders, loading, error } = useOrders();
  const queryClient = useQueryClient();
  const statusMutation = useMutation<any, Error, { id: number; status: string }>({
    mutationFn: async ({ id, status }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      return data;
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
    <div className="mt-10">
      <div className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <h1 className="text-5xl font-bold font-display text-center w-full">Transactions</h1>
      </div>
      {error && <div className="text-red-500 mb-2">Error: {error}</div>}
      {loading ? (
        <div className="p-6 space-y-6 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="overflow-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  {[...Array(5)].map((_, i) => (
                    <th key={i} className="px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="border-t h-12">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold mb-4">Recent Transactions</h1>
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
      )}
    </div>
  );
} 