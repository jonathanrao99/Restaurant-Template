'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export function SalesAnalytics() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [deliveryOrders, setDeliveryOrders] = useState<any[]>([]);
  const [pickupOrders, setPickupOrders] = useState<any[]>([]);
  const [totalDeliveryFees, setTotalDeliveryFees] = useState(0);
  const [shipdayDeliveries, setShipdayDeliveries] = useState(0);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        // Fetch orders data and process for analytics
        const response = await fetch('/api/orders');
        if (response.ok) {
          const orders = await response.json();
          
          // Process data for the selected time range
          const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
          const processed = processOrdersForChart(orders, days);
          setSalesData(processed);

          // After fetching orders, process for new metrics
          const deliveryOrders = orders.filter((o: any) => o.order_type === 'delivery');
          const pickupOrders = orders.filter((o: any) => o.order_type === 'pickup');
          setDeliveryOrders(deliveryOrders);
          setPickupOrders(pickupOrders);
          setTotalDeliveryFees(deliveryOrders.reduce((sum: number, o: any) => sum + (o.delivery_fee || 0), 0));
          setShipdayDeliveries(deliveryOrders.filter((o: any) => o.external_delivery_id).length);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesData();
  }, [timeRange]);

  const processOrdersForChart = (orders: any[], days: number): SalesData[] => {
    const today = new Date();
    const data: SalesData[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at).toISOString().split('T')[0];
        return orderDate === dateString;
      });

      const sales = dayOrders.reduce((sum, order) => sum + order.total_amount, 0);
      
      data.push({
        date: dateString,
        sales: sales,
        orders: dayOrders.length
      });
    }

    return data;
  };

  const calculateTrend = () => {
    if (salesData.length < 2) return { percentage: 0, isPositive: true };
    
    const recent = salesData.slice(-3).reduce((sum, day) => sum + day.sales, 0);
    const previous = salesData.slice(-6, -3).reduce((sum, day) => sum + day.sales, 0);
    
    if (previous === 0) return { percentage: 0, isPositive: true };
    
    const percentage = ((recent - previous) / previous) * 100;
    return { percentage: Math.abs(percentage), isPositive: percentage >= 0 };
  };

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const trend = calculateTrend();

  const maxSales = Math.max(...salesData.map(d => d.sales));

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded text-sm ${
              timeRange === range
                ? 'bg-desi-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold">${totalSales.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex items-center mt-2 text-sm">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.percentage.toFixed(1)}%
            </span>
            <span className="text-gray-500 ml-1">vs previous period</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-desi-orange" />
          </div>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Daily Sales</h3>
        <div className="flex items-end justify-between h-48 gap-1">
          {salesData.map((day, index) => {
            const height = maxSales > 0 ? (day.sales / maxSales) * 100 : 0;
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative flex-1 flex items-end w-full">
                  <div
                    className="bg-desi-orange rounded-t w-full transition-all duration-300 hover:bg-desi-orange/80"
                    style={{ height: `${height}%`, minHeight: '2px' }}
                    title={`${dayName}: $${day.sales.toFixed(2)} (${day.orders} orders)`}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  <div>{dayName}</div>
                  <div className="text-xs text-gray-400">
                    {date.getDate()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New cards/sections for:
        - Total Delivery Fees
        - Order Type Breakdown
        - Shipday Deliveries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Delivery Fees</p>
              <p className="text-2xl font-bold">${totalDeliveryFees.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Order Type Breakdown</p>
              <p className="text-2xl font-bold">{pickupOrders.length} pickup, {deliveryOrders.length} delivery</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipday Deliveries</p>
              <p className="text-2xl font-bold">{shipdayDeliveries}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
} 