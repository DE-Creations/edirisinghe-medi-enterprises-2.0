<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Grn;
use App\Models\Expense;
use App\Models\Product;
use App\Models\Receivable;
use App\Models\StockBatches;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $now           = Carbon::now();
        $weekStart     = $now->copy()->startOfWeek();
        $weekEnd       = $now->copy()->endOfWeek();
        $monthStart    = $now->copy()->startOfMonth();
        $monthEnd      = $now->copy()->endOfMonth();
        $lastWeekStart = $now->copy()->subWeek()->startOfWeek();
        $lastWeekEnd   = $now->copy()->subWeek()->endOfWeek();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd   = $now->copy()->subMonth()->endOfMonth();

        // ── This Week ──
        $weekRevenue   = Invoice::whereBetween('invoice_date', [$weekStart, $weekEnd])->sum('grand_total');
        $weekExpenses  = Expense::whereBetween('date', [$weekStart, $weekEnd])->sum('amount');
        $weekGRN       = Grn::whereBetween('received_date', [$weekStart, $weekEnd])->sum('total_amount');
        $weekProfit    = $weekRevenue - $weekExpenses - $weekGRN;
        $weekInvoices  = Invoice::whereBetween('invoice_date', [$weekStart, $weekEnd])->count();
        $weekCustomers = Invoice::whereBetween('invoice_date', [$weekStart, $weekEnd])
                            ->distinct('customer_id')->count('customer_id');
        $weekSales     = Receivable::whereBetween('dateTime', [$weekStart, $weekEnd])->sum('amount');

        // ── Last Week (for trend) ──
        $lastWeekRevenue  = Invoice::whereBetween('invoice_date', [$lastWeekStart, $lastWeekEnd])->sum('grand_total');
        $lastWeekInvoices = Invoice::whereBetween('invoice_date', [$lastWeekStart, $lastWeekEnd])->count();
        $lastWeekExpenses = Expense::whereBetween('date', [$lastWeekStart, $lastWeekEnd])->sum('amount');
        $lastWeekSales    = Receivable::whereBetween('dateTime', [$lastWeekStart, $lastWeekEnd])->sum('amount');

        // ── This Month ──
        $monthRevenue    = Invoice::whereBetween('invoice_date', [$monthStart, $monthEnd])->sum('grand_total');
        $monthInvoices   = Invoice::whereBetween('invoice_date', [$monthStart, $monthEnd])->count();
        $lastMonthRevenue = Invoice::whereBetween('invoice_date', [$lastMonthStart, $lastMonthEnd])->sum('grand_total');
        $monthSales      = Receivable::whereBetween('dateTime', [$monthStart, $monthEnd])->sum('amount');
        $lastMonthSales  = Receivable::whereBetween('dateTime', [$lastMonthStart, $lastMonthEnd])->sum('amount');

        // ── Products & Stock ──
        $totalProducts = Product::count();

        // Products with stock > 0 (has at least one batch with current_quantity > 0)
        $availableProducts = Product::whereHas('stockBatches', function ($q) {
            $q->where('current_quantity', '>', 0);
        })->count();

        $outOfStock = Product::whereDoesntHave('stockBatches', function ($q) {
            $q->where('current_quantity', '>', 0);
        })->count();

        // Low stock - products whose total current_quantity across all batches is below reorder_level
        $lowStockProducts = Product::withSum('stockBatches', 'current_quantity')
            ->get()
            ->filter(function ($p) {
                return ($p->stock_batches_sum_current_quantity ?? 0) < $p->reorder_level;
            })
            ->values();

        $lowStockItems = $lowStockProducts->count();

        // ── Recent Sales ──
        $recentSales = Invoice::with('customer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($inv) {
                return [
                    'invoice_number' => $inv->invoice_number,
                    'customer'       => $inv->customer?->name ?? 'Walk-in Customer',
                    'amount'         => $inv->grand_total,
                    'date'           => $inv->invoice_date,
                    'created_at'     => $inv->created_at,
                ];
            });

        // ── Low Stock Alerts ──
        $lowStockAlerts = $lowStockProducts->take(5)->map(function ($p) {
            return [
                'name'          => $p->generic_name,
                'stock'         => (int) ($p->stock_batches_sum_current_quantity ?? 0),
                'reorder_level' => $p->reorder_level,
            ];
        })->values();

        // ── Monthly Chart (Jan–Dec of current year) ──
        $monthlyData = [];
        for ($i = 1; $i <= 12; $i++) {
            $month      = $now->copy()->month($i);
            $mStart     = $month->copy()->startOfMonth();
            $mEnd       = $month->copy()->endOfMonth();
            $revenue    = Invoice::whereBetween('invoice_date', [$mStart, $mEnd])->sum('grand_total');
            $expenses   = Expense::whereBetween('date', [$mStart, $mEnd])->sum('amount');
            $monthlyData[] = [
                'month'    => $month->format('M'),
                'revenue'  => round($revenue),
                'expenses' => round($expenses),
            ];
        }

        // ── Trend calculations ──
        $revenueTrend  = $lastWeekRevenue > 0
            ? round((($weekRevenue - $lastWeekRevenue) / $lastWeekRevenue) * 100, 1)
            : 0;
        $expensesTrend = $lastWeekExpenses > 0
            ? round((($weekExpenses - $lastWeekExpenses) / $lastWeekExpenses) * 100, 1)
            : 0;
        $invoiceTrend  = $lastWeekInvoices > 0
            ? $weekInvoices - $lastWeekInvoices
            : $weekInvoices;
        $monthRevTrend = $lastMonthRevenue > 0
            ? round((($monthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;
        $weekSalesTrend = $lastWeekSales > 0
            ? round((($weekSales - $lastWeekSales) / $lastWeekSales) * 100, 1)
            : 0;
        $monthSalesTrend = $lastMonthSales > 0
            ? round((($monthSales - $lastMonthSales) / $lastMonthSales) * 100, 1)
            : 0;

        return response()->json([
            'week' => [
                'revenue'        => $weekRevenue,
                'expenses'       => $weekExpenses,
                'grn_purchases'  => $weekGRN,
                'net_profit'     => $weekProfit,
                'invoices'       => $weekInvoices,
                'customers'      => $weekCustomers,
                'revenue_trend'  => $revenueTrend,
                'expenses_trend' => $expensesTrend,
                'invoice_trend'  => $invoiceTrend,
                'sales'          => $weekSales,
                'sales_trend'    => $weekSalesTrend,
            ],
            'month' => [
                'revenue'        => $monthRevenue,
                'invoices'       => $monthInvoices,
                'revenue_trend'  => $monthRevTrend,
                'sales'          => $monthSales,
                'sales_trend'    => $monthSalesTrend,
            ],
            'inventory' => [
                'total_products'     => $totalProducts,
                'available_products' => $availableProducts,
                'out_of_stock'       => $outOfStock,
                'low_stock_count'    => $lowStockItems,
            ],
            'recent_sales'     => $recentSales,
            'low_stock_alerts' => $lowStockAlerts,
            'monthly_chart'    => $monthlyData,
        ]);
    }
}
