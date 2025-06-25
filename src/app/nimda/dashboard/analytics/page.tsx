'use client';

import { SalesAnalytics } from '@/components/admin/SalesAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="mt-10">
      <div className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <h1 className="text-5xl font-bold font-display text-center w-full">Sales Analytics</h1>
      </div>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesAnalytics />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 