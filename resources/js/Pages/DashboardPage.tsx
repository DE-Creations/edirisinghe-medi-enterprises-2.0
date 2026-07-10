// import { Head } from '@inertiajs/react';
// import AppShell from '@/AppShell';
// import React from 'react';
// import StatCard from '@/components/shared/StatCard';
// import { useAuth } from '@/contexts/AuthContext';
// import {
//   DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown,
//   AlertTriangle, Truck, PackageCheck, PackageX, ReceiptText, BadgeDollarSign,
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// function DashboardPage() {
//   const { user } = useAuth();

//   return (
//     <div className="space-y-6 animate-fade-in">
//       <div>
//         <h1 className="text-xl font-bold">Welcome back, {user?.name}</h1>
//         <p className="text-sm text-muted-foreground">Here's what's happening at your pharmacy this week.</p>
//       </div>

//       {/* Financial Summary */}
//       <div>
//         <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Financial — This Week</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard
//             title="Week's Revenue"
//             value="Rs. 148,320"
//             icon={DollarSign}
//             iconVariant="default"
//             trend="+8.4% from last week"
//             trendUp
//           />
//           <StatCard
//             title="Week's Expenses"
//             value="Rs. 62,750"
//             icon={TrendingDown}
//             iconVariant="destructive"
//             trend="+3.1% from last week"
//           />
//           <StatCard
//             title="Net Profit"
//             value="Rs. 85,570"
//             icon={BadgeDollarSign}
//             iconVariant="success"
//             trend="+12.6% from last week"
//             trendUp
//           />
//           <StatCard
//             title="Purchases (GRN)"
//             value="Rs. 58,400"
//             icon={Truck}
//             iconVariant="warning"
//             trend="4 GRNs this week"
//           />
//         </div>
//       </div>

//       {/* Activity Summary */}
//       <div>
//         <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Activity — This Week</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard
//             title="Invoices This Week"
//             value="94"
//             icon={ShoppingCart}
//             iconVariant="default"
//             trend="+11 from last week"
//             trendUp
//           />
//           <StatCard
//             title="Active Customers"
//             value="43"
//             icon={Users}
//             iconVariant="default"
//           />
//           <StatCard
//             title="Available Products"
//             value="138"
//             icon={PackageCheck}
//             iconVariant="success"
//           />
//           <StatCard
//             title="Out of Stock"
//             value="18"
//             icon={PackageX}
//             iconVariant="destructive"
//             trend="3 more than last week"
//           />
//         </div>
//       </div>

//       {/* Inventory Summary */}
//       <div>
//         <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Inventory</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatCard
//             title="Total Products"
//             value="156"
//             icon={Package}
//             iconVariant="default"
//           />
//           <StatCard
//             title="Low Stock Items"
//             value="12"
//             icon={AlertTriangle}
//             iconVariant="warning"
//             trend="Needs reordering"
//           />
//           <StatCard
//             title="Invoices This Month"
//             value="312"
//             icon={ReceiptText}
//             iconVariant="default"
//             trend="+24 from last month"
//             trendUp
//           />
//           <StatCard
//             title="Month's Revenue"
//             value="Rs. 542,800"
//             icon={TrendingUp}
//             iconVariant="success"
//             trend="+6.2% from last month"
//             trendUp
//           />
//         </div>
//       </div>

//       {/* Details Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {/* Recent Sales */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-semibold">Recent Sales</CardTitle>
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="space-y-3">
//               {[
//                 { name: 'John Smith', amount: 'Rs. 580', time: '2 min ago' },
//                 { name: 'Walk-in Customer', amount: 'Rs. 450', time: '15 min ago' },
//                 { name: 'Mary Johnson', amount: 'Rs. 1,200', time: '1 hr ago' },
//                 { name: 'Walk-in Customer', amount: 'Rs. 320', time: '2 hrs ago' },
//                 { name: 'David Fernando', amount: 'Rs. 875', time: '3 hrs ago' },
//               ].map((sale, i) => (
//                 <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
//                   <div>
//                     <p className="text-sm font-medium">{sale.name}</p>
//                     <p className="text-xs text-muted-foreground">{sale.time}</p>
//                   </div>
//                   <p className="text-sm font-semibold text-primary">{sale.amount}</p>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Low Stock Alerts */}
//         <Card>
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-semibold flex items-center gap-2">
//               <AlertTriangle className="h-4 w-4 text-warning" /> Low Stock Alerts
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-0">
//             <div className="space-y-3">
//               {[
//                 { name: 'Eye Drops 10ml', stock: 8, level: 15 },
//                 { name: 'Cough Syrup 100ml', stock: 12, level: 20 },
//                 { name: 'Amoxicillin 250mg', stock: 25, level: 30 },
//                 { name: 'Vitamin C 500mg', stock: 10, level: 25 },
//                 { name: 'Antacid Tablets', stock: 6, level: 20 },
//               ].map((item, i) => (
//                 <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
//                   <div>
//                     <p className="text-sm font-medium">{item.name}</p>
//                     <p className="text-xs text-muted-foreground">Reorder at: {item.level}</p>
//                   </div>
//                   <span className="text-xs font-bold px-2 py-1 rounded-full bg-destructive/10 text-destructive">
//                     {item.stock} left
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Monthly Revenue vs Expenses Chart */}
//       <Card>
//         <CardHeader className="pb-3">
//           <CardTitle className="text-sm font-semibold flex items-center gap-2">
//             <TrendingUp className="h-4 w-4 text-primary" /> Monthly Revenue vs Expenses
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="pt-0">
//           <div className="flex items-center gap-4 mb-4">
//             <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
//               <span className="inline-block h-2.5 w-2.5 rounded-sm bg-primary/80" /> Revenue
//             </span>
//             <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
//               <span className="inline-block h-2.5 w-2.5 rounded-sm bg-destructive/70" /> Expenses
//             </span>
//           </div>
//           <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
//             {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => {
//               const rev = [45, 52, 48, 65, 58, 72, 68, 75, 62, 80, 78, 85][i];
//               const exp = [30, 35, 32, 42, 38, 45, 44, 48, 40, 50, 49, 52][i];
//               return (
//                 <div key={m} className="flex flex-col items-center gap-1">
//                   <div className="w-full flex gap-0.5 items-end" style={{ height: '100px' }}>
//                     <div
//                       className="flex-1 bg-primary/80 rounded-t-sm transition-all duration-500"
//                       style={{ height: `${rev}%` }}
//                     />
//                     <div
//                       className="flex-1 bg-destructive/70 rounded-t-sm transition-all duration-500"
//                       style={{ height: `${exp}%` }}
//                     />
//                   </div>
//                   <span className="text-[10px] text-muted-foreground">{m}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// export default function WrappedDashboardPage() {
//   return (
//     <>
//       <Head title="Dashboard" />
//       <DashboardPage />
//     </>
//   );
// }

// (WrappedDashboardPage as any).layout = (page: React.ReactNode) => <AppShell>{page}</AppShell>;

import { Head } from '@inertiajs/react';
import AppShell from '@/AppShell';
import React, { useEffect, useState } from 'react';
import StatCard from '@/components/shared/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import {
    DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown,
    AlertTriangle, Truck, PackageCheck, PackageX, ReceiptText, BadgeDollarSign,
    Banknote, CalendarDays,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

// --- Types ---
interface WeekStats {
    revenue:        number;
    expenses:       number;
    grn_purchases:  number;
    net_profit:     number;
    invoices:       number;
    customers:      number;
    revenue_trend:  number;
    expenses_trend: number;
    invoice_trend:  number;
    sales:          number;
    sales_trend:    number;
}

interface MonthStats {
    revenue:       number;
    invoices:      number;
    revenue_trend: number;
    sales:         number;
    sales_trend:   number;
}

interface InventoryStats {
    total_products:     number;
    available_products: number;
    out_of_stock:       number;
    low_stock_count:    number;
}

interface RecentSale {
    invoice_number: string;
    customer:       string;
    amount:         number;
    date:           string;
    created_at:     string;
}

interface LowStockAlert {
    name:          string;
    stock:         number;
    reorder_level: number;
}

interface MonthlyChart {
    month:    string;
    revenue:  number;
    expenses: number;
}

interface DashboardStats {
    week:           WeekStats;
    month:          MonthStats;
    inventory:      InventoryStats;
    recent_sales:   RecentSale[];
    low_stock_alerts: LowStockAlert[];
    monthly_chart:  MonthlyChart[];
}

// Helper to format trend
const trendText = (val: number, suffix = '%') =>
    val === 0 ? 'No change' : `${val > 0 ? '+' : ''}${val}${suffix} from last week`;

function DashboardPage() {
    const { user } = useAuth();
    const [stats,   setStats]   = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/dashboard/stats');
            setStats(res.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    // Max value for chart scaling
    const chartMax = stats
        ? Math.max(...stats.monthly_chart.map((m) => Math.max(m.revenue, m.expenses)), 1)
        : 1;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground text-sm">Loading dashboard...</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-xl font-bold">Welcome back, {user?.name}</h1>
                <p className="text-sm text-muted-foreground">
                    Here's what's happening at your store this week.
                </p>
            </div>

            {/* Financial Summary */}
            <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Financial — This Week
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Weekly Sale"
                        value={`Rs. ${Number(stats.week.revenue).toLocaleString()}`}
                        icon={DollarSign}
                        iconVariant="default"
                        trend={trendText(stats.week.revenue_trend)}
                        trendUp={stats.week.revenue_trend >= 0}
                    />
                    <StatCard
                        title="Week's Expenses"
                        value={`Rs. ${Number(stats.week.expenses).toLocaleString()}`}
                        icon={TrendingDown}
                        iconVariant="destructive"
                        trend={trendText(stats.week.expenses_trend)}
                        trendUp={stats.week.expenses_trend <= 0}
                    />
                    <StatCard
                        title="Net Profit"
                        value={`Rs. ${Number(stats.week.net_profit).toLocaleString()}`}
                        icon={BadgeDollarSign}
                        iconVariant={stats.week.net_profit >= 0 ? 'success' : 'destructive'}
                        trend="Revenue - Expenses - GRN"
                        trendUp={stats.week.net_profit >= 0}
                    />
                    <StatCard
                        title="Purchases (GRN)"
                        value={`Rs. ${Number(stats.week.grn_purchases).toLocaleString()}`}
                        icon={Truck}
                        iconVariant="warning"
                        trend="This week's GRN total"
                    />
                </div>
            </div>

            {/* Sales — Actual Received */}
            <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Revenue — Actual Received
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard
                        title="Week's Revenue"
                        value={`Rs. ${Number(stats.week.sales).toLocaleString()}`}
                        icon={Banknote}
                        iconVariant="success"
                        trend={trendText(stats.week.sales_trend)}
                        trendUp={stats.week.sales_trend >= 0}
                    />
                    <StatCard
                        title="Month's Revenue"
                        value={`Rs. ${Number(stats.month.sales).toLocaleString()}`}
                        icon={CalendarDays}
                        iconVariant="success"
                        trend={`${stats.month.sales_trend > 0 ? '+' : ''}${stats.month.sales_trend}% from last month`}
                        trendUp={stats.month.sales_trend >= 0}
                    />
                </div>
            </div>

            {/* Activity Summary */}            <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Activity — This Week
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Invoices This Week"
                        value={String(stats.week.invoices)}
                        icon={ShoppingCart}
                        iconVariant="default"
                        trend={`${stats.week.invoice_trend > 0 ? '+' : ''}${stats.week.invoice_trend} from last week`}
                        trendUp={stats.week.invoice_trend >= 0}
                    />
                    <StatCard
                        title="Active Customers"
                        value={String(stats.week.customers)}
                        icon={Users}
                        iconVariant="default"
                        trend="Unique customers this week"
                    />
                    <StatCard
                        title="Available Products"
                        value={String(stats.inventory.available_products)}
                        icon={PackageCheck}
                        iconVariant="success"
                        trend="Products with stock"
                    />
                    <StatCard
                        title="Out of Stock"
                        value={String(stats.inventory.out_of_stock)}
                        icon={PackageX}
                        iconVariant="destructive"
                        trend="Products with no stock"
                    />
                </div>
            </div>

            {/* Inventory Summary */}
            <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Inventory
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Products"
                        value={String(stats.inventory.total_products)}
                        icon={Package}
                        iconVariant="default"
                    />
                    <StatCard
                        title="Low Stock Items"
                        value={String(stats.inventory.low_stock_count)}
                        icon={AlertTriangle}
                        iconVariant="warning"
                        trend="Needs reordering"
                    />
                    <StatCard
                        title="Invoices This Month"
                        value={String(stats.month.invoices)}
                        icon={ReceiptText}
                        iconVariant="default"
                        trend="This calendar month"
                    />
                    <StatCard
                        title="Monthly Sale"
                        value={`Rs. ${Number(stats.month.revenue).toLocaleString()}`}
                        icon={TrendingUp}
                        iconVariant="success"
                        trend={trendText(stats.month.revenue_trend)}
                        trendUp={stats.month.revenue_trend >= 0}
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
                            {stats.recent_sales.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                    No sales yet.
                                </p>
                            ) : stats.recent_sales.map((sale, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{sale.customer}</p>
                                        <p className="text-xs text-muted-foreground font-mono">{sale.invoice_number}</p>
                                        <p className="text-xs text-muted-foreground">{sale.date}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-primary">
                                        Rs. {Number(sale.amount).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock Alerts */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" /> Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {stats.low_stock_alerts.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                    All stock levels are fine! ✅
                                </p>
                            ) : stats.low_stock_alerts.map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Reorder at: {item.reorder_level}
                                        </p>
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
                    <div className="overflow-x-auto">
                    <div className="grid grid-cols-12 gap-2 min-w-[480px]">
                        {stats.monthly_chart.map((m, i) => {
                            const revPct = chartMax > 0 ? (m.revenue / chartMax) * 100 : 0;
                            const expPct = chartMax > 0 ? (m.expenses / chartMax) * 100 : 0;
                            return (
                                <div key={i} className="flex flex-col items-center gap-1 group">
                                    <div className="relative w-full flex gap-0.5 items-end" style={{ height: '100px' }}>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap shadow">
                                            <p className="text-primary">Rev: Rs. {m.revenue.toLocaleString()}</p>
                                            <p className="text-destructive">Exp: Rs. {m.expenses.toLocaleString()}</p>
                                        </div>
                                        <div className="flex-1 bg-primary/80 rounded-t-sm transition-all duration-500"
                                            style={{ height: `${revPct}%` }} />
                                        <div className="flex-1 bg-destructive/70 rounded-t-sm transition-all duration-500"
                                            style={{ height: `${expPct}%` }} />
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{m.month}</span>
                                </div>
                            );
                        })}
                    </div>
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