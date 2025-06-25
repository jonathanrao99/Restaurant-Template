'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Eye,
  MessageSquare,
  Mail,
  Star,
  QrCode
} from 'lucide-react';

interface DashboardData {
  sales: {
    total: number;
    today: number;
    trend: number;
  };
  orders: {
    total: number;
    today: number;
    pending: number;
  };
  analytics: {
    visitors: number;
    pageviews: number;
    bounceRate: number;
  };
  reviews: {
    average: number;
    total: number;
    recent: number;
  };
  newsletter: {
    subscribers: number;
    openRate: number;
  };
}

export function MinimalisticDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from multiple APIs in parallel
      const [
        ordersRes,
        umamiRes,
        reviewsRes,
        newsletterRes
      ] = await Promise.all([
        fetch('/api/orders'),
        fetch(`/api/umami/stats?type=stats&startDate=${getStartDate()}`),
        fetch('/api/reviews'),
        fetch('/api/newsletter?action=subscribers')
      ]);

      const [orders, umami, reviews, newsletter] = await Promise.all([
        ordersRes.json(),
        umamiRes.json(),
        reviewsRes.json(),
        newsletterRes.json()
      ]);

      // Process orders data
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter((order: any) => 
        new Date(order.created_at).toISOString().split('T')[0] === today
      );
      
      const totalSales = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
      const todaySales = todayOrders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
      const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;

      // Calculate sales trend
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const yesterdayOrders = orders.filter((order: any) => 
        new Date(order.created_at).toISOString().split('T')[0] === yesterday
      );
      const yesterdaySales = yesterdayOrders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
      const salesTrend = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;

      // Process reviews
      const avgRating = reviews.reviews?.length > 0 
        ? reviews.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.reviews.length 
        : 0;

      setData({
        sales: {
          total: totalSales,
          today: todaySales,
          trend: salesTrend
        },
        orders: {
          total: orders.length,
          today: todayOrders.length,
          pending: pendingOrders
        },
        analytics: {
          visitors: umami.visitors?.value || 0,
          pageviews: umami.pageviews?.value || 0,
          bounceRate: umami.bounces?.value || 0
        },
        reviews: {
          average: avgRating,
          total: reviews.reviews?.length || 0,
          recent: reviews.reviews?.filter((r: any) => 
            new Date(r.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length || 0
        },
        newsletter: {
          subscribers: newsletter.count || 0,
          openRate: 0 // This would come from email service analytics
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      label: 'Revenue Today',
      value: formatCurrency(data.sales.today),
      icon: DollarSign,
      trend: data.sales.trend,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(data.sales.total),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Orders Today',
      value: data.orders.today.toString(),
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Pending Orders',
      value: data.orders.pending.toString(),
      icon: ShoppingCart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Website Visitors',
      value: formatNumber(data.analytics.visitors),
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Page Views',
      value: formatNumber(data.analytics.pageviews),
      icon: Eye,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      label: 'Avg Review Rating',
      value: data.reviews.average.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Newsletter Subs',
      value: formatNumber(data.newsletter.subscribers),
      icon: Mail,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex gap-2">
        {(['7d', '30d', '90d'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimeframe(period)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeframe === period
                ? 'bg-desi-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      {metric.trend !== undefined && (
                        <div className={`flex items-center text-sm ${
                          metric.trend >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.trend >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(metric.trend).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                View Pending Orders
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                Update Menu Items
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                Send Newsletter
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{data.orders.today} orders placed today</p>
              <p>{data.reviews.recent} new reviews this week</p>
              <p>{formatNumber(data.analytics.visitors)} unique visitors</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Alerts</h3>
            <div className="space-y-2 text-sm">
              {data.orders.pending > 0 && (
                <p className="text-orange-600">{data.orders.pending} orders need attention</p>
              )}
              {data.reviews.average < 4 && (
                <p className="text-red-600">Review rating below 4.0</p>
              )}
              {data.analytics.bounceRate > 70 && (
                <p className="text-yellow-600">High bounce rate detected</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 