"use client";

import React from "react";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useOrders } from "@/hooks/useOrders";

export default function DashboardPage() {
  const { menuItems, loading: menuLoading, error: menuError } = useMenuItems();
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();

  return (
    <div className="space-y-6 w-full">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Menu Items */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-desi-orange mb-1">Total Menu Items</h2>
          {menuLoading ? (
            <p>Loading...</p>
          ) : menuError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-desi-black">{menuItems.length}</p>
          )}
        </div>
        {/* Total Orders */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-desi-orange mb-1">Total Orders</h2>
          {ordersLoading ? (
            <p>Loading...</p>
          ) : ordersError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-desi-black">{orders.length}</p>
          )}
        </div>
        {/* Total Revenue */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-desi-orange mb-1">Total Revenue</h2>
          {ordersLoading ? (
            <p>Loading...</p>
          ) : ordersError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-desi-black">${orders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}</p>
          )}
        </div>
        {/* Average Order Value */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-desi-orange mb-1">Avg Order Value</h2>
          {ordersLoading ? (
            <p>Loading...</p>
          ) : ordersError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-desi-black">${(orders.length ? orders.reduce((sum, o) => sum + o.total_amount, 0) / orders.length : 0).toFixed(2)}</p>
          )}
        </div>
        {/* Completed Orders */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-desi-orange mb-1">Completed Orders</h2>
          {ordersLoading ? (
            <p>Loading...</p>
          ) : ordersError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-desi-black">{orders.filter(o => o.status === 'completed').length}</p>
          )}
        </div>
        {/* Pending Orders */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-desi-orange mb-1">Pending Orders</h2>
          {ordersLoading ? (
            <p>Loading...</p>
          ) : ordersError ? (
            <p className="text-red-500">Error</p>
          ) : (
            <p className="text-3xl font-bold text-desi-black">{orders.filter(o => o.status === 'pending').length}</p>
          )}
        </div>
      </div>

      {/* Tables Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow border border-zinc-200 w-full lg:w-3/4">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-900">Recent Transactions</h2>
          {ordersLoading ? (
            <p className="text-zinc-500">Loading transactions...</p>
          ) : ordersError ? (
            <p className="text-red-500">Error loading transactions: {ordersError}</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-left text-base">
                <thead>
                  <tr className="text-black border-b border-zinc-200">
                    <th className="py-2 font-medium">ID</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Time</th>
                    <th className="py-2 font-medium">Customer</th>
                    <th className="py-2 font-medium">Phone</th>
                    <th className="py-2 font-medium">Type</th>
                    <th className="py-2 font-medium text-right">Amount</th>
                    <th className="py-2 font-medium pl-8">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map(order => {
                    const dateObj = new Date(order.created_at);
                    return (
                      <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition">
                        <td className="py-2 text-black font-semibold">{order.id}</td>
                        <td className="py-2 text-black">{dateObj.toLocaleDateString()}</td>
                        <td className="py-2 text-black">{dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-2 text-black">{order.customer_name}</td>
                        <td className="py-2 text-black">{order.customer_phone || '-'}</td>
                        <td className="py-2 text-black">{order.order_type ? order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1) : '-'}</td>
                        <td className="py-2 text-right text-desi-orange font-bold">${order.total_amount.toFixed(2)}</td>
                        <td className="py-2 pl-8">
                          {order.status.toLowerCase() === 'pending' && (
                            <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-black text-xs font-semibold">Pending</span>
                          )}
                          {order.status.toLowerCase() === 'completed' && (
                            <span className="inline-block px-3 py-1 rounded-full bg-green-200 text-green-800 text-xs font-semibold">Completed</span>
                          )}
                          {order.status.toLowerCase() === 'failed' && (
                            <span className="inline-block px-3 py-1 rounded-full bg-red-200 text-red-800 text-xs font-semibold">Failed</span>
                          )}
                          {order.status.toLowerCase() !== 'pending' && order.status.toLowerCase() !== 'completed' && order.status.toLowerCase() !== 'failed' && (
                            <span className="inline-block px-3 py-1 rounded-full bg-zinc-200 text-black text-xs font-semibold">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top-Selling Menu Items */}
        <div className="bg-white p-6 pr-8 rounded-2xl shadow border border-zinc-200 w-full lg:w-1/4">
          <h2 className="text-2xl font-semibold mb-4 text-zinc-900">Top-Selling Menu Items</h2>
          <p className="text-zinc-500">Coming soon...</p>
        </div>
      </div>

      {/* Recent Blog Posts */}
      <div className="bg-white p-6 rounded-2xl shadow border border-zinc-200">
        <h2 className="text-2xl font-semibold mb-4 text-zinc-900">Recent Blog Posts</h2>
        <p className="text-zinc-500">Coming soon...</p>
      </div>
    </div>
  );
} 