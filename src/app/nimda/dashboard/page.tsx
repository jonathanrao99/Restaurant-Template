'use client';

import React from 'react';
import AnalyticCard from './components/AnalyticCard';
import UniqueVisitorCard from './components/UniqueVisitorCard';
import IncomeOverview from './components/IncomeOverview';
import ReportAreaChart from './components/ReportAreaChart';
import OrdersTable from './components/OrdersTable';
import SaleReportCard from './components/SaleReportCard';
import TransactionHistory from './components/TransactionHistory';

export default function NimdaDashboard() {
  return (
    <div className="p-6 overflow-auto">
      <h1 className="text-3xl font-display font-bold text-desi-black mb-6">Dashboard</h1>

      {/* Row 1: Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <AnalyticCard title="Total Page Views" count="442,236" percentage={59.3} extra="35,000" />
        <AnalyticCard title="Total Users" count="78,250" percentage={70.5} extra="8,900" />
        <AnalyticCard title="Total Order" count="18,800" percentage={27.4} extra="1,943" isLoss />
        <AnalyticCard title="Total Sales" count="35,078" percentage={27.4} extra="20,395" />
      </div>

      {/* Row 2: Unique Visitor & Income Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <UniqueVisitorCard />
        </div>
        <div>
          <IncomeOverview />
        </div>
      </div>

      {/* Row 3: Orders Table & Analytics Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <OrdersTable />
        </div>
        <div>
          <ReportAreaChart />
        </div>
      </div>

      {/* Row 4: Sales Report & Transaction History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <SaleReportCard />
        </div>
        <div>
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
} 