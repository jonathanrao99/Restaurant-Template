'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Users, Star, TrendingUp, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Customer {
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastOrderDate: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    avgOrderValue: 0,
    topSpender: '',
    totalLoyaltyPoints: 0
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const supabase = createClient();
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('customer_name,customer_email,customer_phone,total_amount,created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      // Group by customer
      const customerMap = new Map();
      
      orders.forEach((order: any) => {
        const key = order.customer_email || order.customer_phone;
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            orderCount: 0,
            totalSpent: 0,
            loyaltyPoints: 0,
            lastOrderDate: order.created_at
          });
        }
        
        const customer = customerMap.get(key);
        customer.orderCount++;
        customer.totalSpent += order.total_amount;
        customer.loyaltyPoints = Math.floor(customer.totalSpent);
        
        if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.created_at;
        }
      });
      
      const customerList = Array.from(customerMap.values())
        .sort((a, b) => b.totalSpent - a.totalSpent);
      
      setCustomers(customerList);
      
      // Calculate stats
      const totalCustomers = customerList.length;
      const avgOrderValue = customerList.reduce((sum, c) => sum + c.totalSpent, 0) / totalCustomers || 0;
      const topSpender = customerList[0]?.name || '';
      const totalLoyaltyPoints = customerList.reduce((sum, c) => sum + c.loyaltyPoints, 0);
      
      setStats({ totalCustomers, avgOrderValue, topSpender, totalLoyaltyPoints });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-32 bg-gray-200 rounded-xl"></Card>
          ))}
        </div>

        {/* Customer Table Skeleton */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="p-6 border-b">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="px-6 py-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="h-20">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-desi-black">Customer Management</h1>
        <Button className="bg-desi-orange text-white">Export Customer Data</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-desi-orange" />
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Avg Customer Value</p>
              <p className="text-2xl font-bold">${stats.avgOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Top Spender</p>
              <p className="text-lg font-semibold">{stats.topSpender}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Total Loyalty Points</p>
              <p className="text-2xl font-bold">{stats.totalLoyaltyPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Customer List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyalty Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {customer.orderCount} orders
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {customer.loyaltyPoints} pts
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 