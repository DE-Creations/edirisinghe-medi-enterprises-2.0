import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React from 'react';
import StatCard from '@/components/shared/StatCard';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

function ReportsPage() {
  const dailyRevenue = 24580;
  const monthlyRevenue = 682400;
  const yearlyRevenue = 7250000;

  const monthlyData = [
    { month: 'Jan', revenue: 520000 },
    { month: 'Feb', revenue: 580000 },
    { month: 'Mar', revenue: 610000 },
    { month: 'Apr', revenue: 682400 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-bold">Revenue Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Daily Revenue" value={`Rs. ${dailyRevenue.toLocaleString()}`} icon={DollarSign} trend="+12.5% from yesterday" trendUp />
        <StatCard title="Monthly Revenue" value={`Rs. ${monthlyRevenue.toLocaleString()}`} icon={Calendar} trend="+8.3% from last month" trendUp />
        <StatCard title="Yearly Revenue" value={`Rs. ${yearlyRevenue.toLocaleString()}`} icon={TrendingUp} trend="+15.2% from last year" trendUp />
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-semibold mb-4">Monthly Breakdown</h3>
        <div className="space-y-3">
          {monthlyData.map((m) => (
            <div key={m.month} className="flex items-center gap-4">
              <span className="text-sm w-10 text-muted-foreground">{m.month}</span>
              <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                <div className="h-full bg-primary rounded-full flex items-center justify-end px-2 transition-all duration-500" style={{ width: `${(m.revenue / 800000) * 100}%` }}>
                  <span className="text-[10px] font-semibold text-primary-foreground">Rs. {(m.revenue / 1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function WrappedReportsPage() {
  return (
    <>
      <Head title="Reports" />
      <ReportsPage />
    </>
  );
}

(WrappedReportsPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;
