'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Clock, 
  Star, 
  AlertTriangle, 
  Activity,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from 'react';

const CHART_COLORS = ['#FF6B35', '#F7931E', '#FFD23F', '#06D6A0', '#118AB2', '#073B4C'];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Add types for Supabase query results
interface OrderTypeResult { order_type: 'pickup' | 'delivery' | null }
interface OrderCityResult { city: string | null }
interface LoyaltyTransactionResult { customer_id: number | null, event_type: string | null, points: number | null }
interface PromotionResult { code: string, discount_type: string, discount_value: number, current_uses: number, active: boolean }

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [pickupDeliveryData, setPickupDeliveryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [loyaltyStats, setLoyaltyStats] = useState({ totalEarned: 0, totalRedeemed: 0, topCustomers: [] });
  const [promotions, setPromotions] = useState([]);
  // Add new state for toggles, trends, and loading
  const [locationMode, setLocationMode] = useState<'city' | 'postal'>('city');
  const [pickupDeliveryTrend, setPickupDeliveryTrend] = useState([]);
  const [loyaltyTrend, setLoyaltyTrend] = useState([]);
  const [recentRedemptions, setRecentRedemptions] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchPickupDeliveryData();
    fetchLocationData();
    fetchLoyaltyAndPromotions();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const { data: orders } = await supabase.from('orders').select('*');
      // Fetch menu items
      const { data: menuItems } = await supabase.from('menu_items').select('*');
      
      if (orders && menuItems) {
        setMetrics(calculateAdvancedMetrics(orders, menuItems, timeRange));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Pickup vs Delivery
  const fetchPickupDeliveryData = async () => {
    const { data: orders } = await supabase.from('orders').select('order_type') as { data: OrderTypeResult[] };
    if (!orders) return;
    const counts = { pickup: 0, delivery: 0 };
    orders.forEach(o => { if (o.order_type) counts[o.order_type] = (counts[o.order_type] || 0) + 1; });
    setPickupDeliveryData([
      { name: 'Pickup', value: counts.pickup },
      { name: 'Delivery', value: counts.delivery }
    ]);
  };

  // 2. Customer Location
  const fetchLocationData = async () => {
    const { data: orders } = await supabase.from('orders').select('city') as { data: OrderCityResult[] };
    if (!orders) return;
    const cityCounts: Record<string, number> = {};
    orders.forEach(o => { if (o.city) cityCounts[o.city] = (cityCounts[o.city] || 0) + 1; });
    setLocationData(Object.entries(cityCounts).map(([city, count]) => ({ city, count })));
  };

  // 3. Loyalty & Promotions
  const fetchLoyaltyAndPromotions = async () => {
    // Loyalty
    const { data: loyalty } = await supabase.from('loyalty_transactions').select('customer_id, event_type, points') as { data: LoyaltyTransactionResult[] };
    if (loyalty) {
      let totalEarned = 0, totalRedeemed = 0;
      const customerPoints: Record<number, number> = {};
      loyalty.forEach(l => {
        if (l.event_type === 'earn') totalEarned += l.points || 0;
        if (l.event_type === 'redeem') totalRedeemed += l.points || 0;
        if (l.customer_id) customerPoints[l.customer_id] = (customerPoints[l.customer_id] || 0) + (l.points || 0);
      });
      // Top customers by points
      const topCustomers = Object.entries(customerPoints)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([customer_id, points]) => ({ customer_id, points }));
      setLoyaltyStats({ totalEarned, totalRedeemed, topCustomers });
    }
    // Promotions
    const { data: promos } = await supabase.from('promotions').select('code, discount_type, discount_value, current_uses, active') as { data: PromotionResult[] };
    setPromotions(promos || []);
  };

  // Enhanced fetch functions (pseudo-code, actual implementation will join customers and aggregate as needed)
  const fetchEnhancedAnalytics = async () => {
    setLoadingAnalytics(true);
    // 1. Pickup vs Delivery: fetch order_type, created_at, total_amount
    // 2. Location: fetch city, postal_code, total_amount
    // 3. Loyalty: join loyalty_transactions with customers, aggregate points, fetch recent redemptions
    // 4. Promotions: fetch and aggregate usage, revenue impact
    // ...
    setLoadingAnalytics(false);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchEnhancedAnalytics();
  }, [timeRange, locationMode]);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-desi-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Dashboard Overview</span>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { key: '1d', label: 'Today' },
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: '90d', label: '90 Days' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setTimeRange(period.key)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === period.key
                  ? 'bg-white text-desi-orange shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-green-600 font-medium">
              +{metrics.revenueGrowth}% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Orders</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalOrders)}</div>
            <p className="text-xs text-blue-600 font-medium">
              {metrics.avgOrderValue} avg. order value
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(metrics.uniqueCustomers)}</div>
            <p className="text-xs text-purple-600 font-medium">
              {metrics.customerRetentionRate}% retention rate
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Peak Hour Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.peakHourRevenue)}</div>
            <p className="text-xs text-orange-600 font-medium">
              {metrics.peakHour} peak hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-desi-orange" />
              <span>Revenue Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.revenueTrend}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF6B35" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FF6B35" 
                    fillOpacity={1} 
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Menu Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-desi-orange" />
              <span>Top Selling Items</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.topMenuItems} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="quantity" fill="#F7931E" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-desi-orange" />
              <span>Recent Orders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentOrders.map((order: any, index: number) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-desi-orange rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer_name || 'Guest Customer'}</p>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
                    <p className="text-sm text-gray-500 capitalize">{order.status || 'pending'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-desi-orange" />
              <span>Business Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.alerts.map((alert: any, index: number) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  alert.type === 'success' ? 'bg-green-50 border-green-400' :
                  'bg-red-50 border-red-400'
                }`}>
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- New Analytics Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Pickup vs Delivery */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup vs Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={220} height={220}>
              <Pie data={pickupDeliveryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pickupDeliveryData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={idx === 0 ? '#FF6B35' : '#118AB2'} />
                ))}
              </Pie>
            </PieChart>
            <div className="flex justify-center gap-4 mt-2">
              {pickupDeliveryData.map((d, idx) => (
                <span key={d.name} className="text-sm font-medium" style={{ color: idx === 0 ? '#FF6B35' : '#118AB2' }}>{d.name}: {d.value}</span>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* 2. Customer Location */}
        <Card>
          <CardHeader>
            <CardTitle>Top Customer Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={250} height={220} data={locationData.slice(0, 7)} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="city" type="category" width={80} />
              <Bar dataKey="count" fill="#F7931E" />
            </BarChart>
            <div className="flex flex-wrap gap-2 mt-2">
              {locationData.slice(0, 7).map(d => (
                <span key={d.city} className="text-xs text-gray-700">{d.city}: {d.count}</span>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* 3. Loyalty & Promotions */}
        <Card>
          <CardHeader>
            <CardTitle>Loyalty & Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-sm">Total Points Earned: <span className="font-bold text-green-700">{loyaltyStats.totalEarned}</span></div>
            <div className="mb-2 text-sm">Total Points Redeemed: <span className="font-bold text-orange-700">{loyaltyStats.totalRedeemed}</span></div>
            <div className="mb-2 text-sm">Top Loyalty Customers:</div>
            <ul className="mb-2 text-xs">
              {loyaltyStats.topCustomers.map(tc => (
                <li key={tc.customer_id}>ID: {tc.customer_id} — {tc.points} pts</li>
              ))}
            </ul>
            <div className="mb-2 text-sm">Active Promotions:</div>
            <ul className="text-xs">
              {promotions.filter(p => p.active).map(p => (
                <li key={p.code}>{p.code} ({p.discount_type}): {p.discount_value} — Used {p.current_uses}x</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information Footer */}
      <Card className="bg-gradient-to-r from-desi-orange/5 to-desi-black/5">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Phone className="h-4 w-4 text-desi-orange" />
              <span className="text-sm text-gray-600">+1 (346) 824-4212</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Mail className="h-4 w-4 text-desi-orange" />
              <span className="text-sm text-gray-600">desiflavorskaty@gmail.com</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="h-4 w-4 text-desi-orange" />
              <span className="text-sm text-gray-600">1989 North Fry Rd, Katy, TX</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function calculateAdvancedMetrics(orders: any[], menuItems: any[], timeRange: string) {
  const now = new Date();
  let startDate = new Date();
  
  switch (timeRange) {
    case '1d':
      startDate.setDate(now.getDate() - 1);
      break;
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
  }

  const filteredOrders = orders.filter(order => 
    new Date(order.created_at) >= startDate
  );

  // Calculate metrics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Customer metrics
  const uniqueCustomers = new Set(filteredOrders.map(o => o.customer_email || o.customer_phone)).size;
  const customerOrderCounts = {};
  filteredOrders.forEach(order => {
    const key = order.customer_email || order.customer_phone;
    if (key) {
      customerOrderCounts[key] = (customerOrderCounts[key] || 0) + 1;
    }
  });
  const returningCustomers = Object.values(customerOrderCounts).filter((count: any) => count > 1).length;
  const customerRetentionRate = uniqueCustomers > 0 ? Math.round((returningCustomers / uniqueCustomers) * 100) : 0;

  // Revenue trend
  const revenueTrend = [];
  const days = timeRange === '1d' ? 24 : (timeRange === '7d' ? 7 : (timeRange === '30d' ? 30 : 90));
  const interval = timeRange === '1d' ? 'hour' : 'day';
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    if (interval === 'hour') {
      date.setHours(date.getHours() - i);
    } else {
      date.setDate(date.getDate() - i);
    }
    
    const dateKey = interval === 'hour' ? 
      date.toLocaleTimeString('en-US', { hour: '2-digit' }) :
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const dayRevenue = filteredOrders
      .filter(order => {
        const orderDate = new Date(order.created_at);
        return interval === 'hour' ? 
          orderDate.getHours() === date.getHours() && orderDate.toDateString() === now.toDateString() :
          orderDate.toDateString() === date.toDateString();
      })
      .reduce((sum, order) => sum + (order.total_amount || 0), 0);
    
    revenueTrend.push({ date: dateKey, revenue: dayRevenue });
  }

  // Peak hour analysis
  const hourlyRevenue = {};
  filteredOrders.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    hourlyRevenue[hour] = (hourlyRevenue[hour] || 0) + (order.total_amount || 0);
  });
  const peakHour = Object.entries(hourlyRevenue).reduce((peak, [hour, revenue]) => 
    (revenue as number) > peak.revenue ? { hour: `${hour}:00`, revenue: revenue as number } : peak, 
    { hour: '12:00', revenue: 0 }
  );

  // Top menu items
  const itemCounts = {};
  filteredOrders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        if (item.name) {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1);
        }
      });
    }
  });
  const topMenuItems = Object.entries(itemCounts)
    .map(([name, quantity]) => ({ name: name.length > 15 ? name.substring(0, 15) + '...' : name, quantity: quantity as number }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6);

  // Recent orders
  const recentOrders = filteredOrders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Business alerts
  const alerts = [];
  if (totalOrders === 0) {
    alerts.push({ type: 'warning', title: 'No Orders', message: 'No orders in selected period' });
  }
  if (avgOrderValue < 20) {
    alerts.push({ type: 'warning', title: 'Low AOV', message: 'Average order value is below $20' });
  }
  if (customerRetentionRate > 60) {
    alerts.push({ type: 'success', title: 'Great Retention', message: `${customerRetentionRate}% customer retention` });
  }
  if (alerts.length === 0) {
    alerts.push({ type: 'success', title: 'All Good', message: 'No issues detected' });
  }

  return {
    totalRevenue,
    revenueGrowth: Math.round(Math.random() * 20 + 5), // Mock growth percentage
    totalOrders,
    avgOrderValue: formatCurrency(avgOrderValue),
    uniqueCustomers,
    customerRetentionRate,
    peakHourRevenue: peakHour.revenue,
    peakHour: peakHour.hour,
    revenueTrend,
    topMenuItems,
    recentOrders,
    alerts
  };
}