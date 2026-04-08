import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React from 'react';
import StatCard from '@/components/shared/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown,
  AlertTriangle, Truck, PackageCheck, PackageX, ReceiptText, BadgeDollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening at your pharmacy this week.</p>
      </div>

      {/* Financial Summary */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Financial — This Week</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Week's Revenue"
            value="Rs. 148,320"
            icon={DollarSign}
            iconVariant="default"
            trend="+8.4% from last week"
            trendUp
          />
          <StatCard
            title="Week's Expenses"
            value="Rs. 62,750"
            icon={TrendingDown}
            iconVariant="destructive"
            trend="+3.1% from last week"
          />
          <StatCard
            title="Net Profit"
            value="Rs. 85,570"
            icon={BadgeDollarSign}
            iconVariant="success"
            trend="+12.6% from last week"
            trendUp
          />
          <StatCard
            title="Purchases (GRN)"
            value="Rs. 58,400"
            icon={Truck}
            iconVariant="warning"
            trend="4 GRNs this week"
          />
        </div>
      </div>

      {/* Activity Summary */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Activity — This Week</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Invoices This Week"
            value="94"
            icon={ShoppingCart}
            iconVariant="default"
            trend="+11 from last week"
            trendUp
          />
          <StatCard
            title="Active Customers"
            value="43"
            icon={Users}
            iconVariant="default"
          />
          <StatCard
            title="Available Products"
            value="138"
            icon={PackageCheck}
            iconVariant="success"
          />
          <StatCard
            title="Out of Stock"
            value="18"
            icon={PackageX}
            iconVariant="destructive"
            trend="3 more than last week"
          />
        </div>
      </div>

      {/* Inventory Summary */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Inventory</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value="156"
            icon={Package}
            iconVariant="default"
          />
          <StatCard
            title="Low Stock Items"
            value="12"
            icon={AlertTriangle}
            iconVariant="warning"
            trend="Needs reordering"
          />
          <StatCard
            title="Invoices This Month"
            value="312"
            icon={ReceiptText}
            iconVariant="default"
            trend="+24 from last month"
            trendUp
          />
          <StatCard
            title="Month's Revenue"
            value="Rs. 542,800"
            icon={TrendingUp}
            iconVariant="success"
            trend="+6.2% from last month"
            trendUp
          />
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sales */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {[
                { name: 'John Smith', amount: 'Rs. 580', time: '2 min ago' },
                { name: 'Walk-in Customer', amount: 'Rs. 450', time: '15 min ago' },
                { name: 'Mary Johnson', amount: 'Rs. 1,200', time: '1 hr ago' },
                { name: 'Walk-in Customer', amount: 'Rs. 320', time: '2 hrs ago' },
                { name: 'David Fernando', amount: 'Rs. 875', time: '3 hrs ago' },
              ].map((sale, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{sale.name}</p>
                    <p className="text-xs text-muted-foreground">{sale.time}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">{sale.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {[
                { name: 'Eye Drops 10ml', stock: 8, level: 15 },
                { name: 'Cough Syrup 100ml', stock: 12, level: 20 },
                { name: 'Amoxicillin 250mg', stock: 25, level: 30 },
                { name: 'Vitamin C 500mg', stock: 10, level: 25 },
                { name: 'Antacid Tablets', stock: 6, level: 20 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Reorder at: {item.level}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue vs Expenses Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Monthly Revenue vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/80" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-destructive/70" /> Expenses
            </span>
          </div>
          <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => {
              const rev = [45, 52, 48, 65, 58, 72, 68, 75, 62, 80, 78, 85][i];
              const exp = [30, 35, 32, 42, 38, 45, 44, 48, 40, 50, 49, 52][i];
              return (
                <div key={m} className="flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: '100px' }}>
                    <div
                      className="flex-1 bg-primary/80 rounded-t-sm transition-all duration-500"
                      style={{ height: `${rev}%` }}
                    />
                    <div
                      className="flex-1 bg-destructive/70 rounded-t-sm transition-all duration-500"
                      style={{ height: `${exp}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{m}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function WrappedDashboardPage() {
  return (
    <>
      <Head title="Dashboard" />
      <DashboardPage />
    </>
  );
}

(WrappedDashboardPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;
