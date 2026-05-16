<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Grn;
use App\Models\Expense;
use App\Models\Product;
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

        // ── Last Week (for trend) ──
        $lastWeekRevenue  = Invoice::whereBetween('invoice_date', [$lastWeekStart, $lastWeekEnd])->sum('grand_total');
        $lastWeekInvoices = Invoice::whereBetween('invoice_date', [$lastWeekStart, $lastWeekEnd])->count();
        $lastWeekExpenses = Expense::whereBetween('date', [$lastWeekStart, $lastWeekEnd])->sum('amount');

        // ── This Month ──
        $monthRevenue  = Invoice::whereBetween('invoice_date', [$monthStart, $monthEnd])->sum('grand_total');
        $monthInvoices = Invoice::whereBetween('invoice_date', [$monthStart, $monthEnd])->count();
        $lastMonthRevenue = Invoice::whereBetween('invoice_date', [$lastMonthStart, $lastMonthEnd])->sum('grand_total');

        // ── Products & Stock ──
        $totalProducts = Product::count();

        // Products with stock > 0 (has at least one batch with current_quantity > 0)
        $availableProducts = Product::whereHas('stockBatches', function ($q) {
            $q->where('current_quantity', '>', 0);
        })->count();

        $outOfStock = Product::whereDoesntHave('stockBatches', function ($q) {
            $q->where('current_quantity', '>', 0);
        })->count();

        // Low stock - batches where current_quantity <= product reorder_level
        $lowStockItems = StockBatches::with('product')
            ->where('current_quantity', '>', 0)
            ->whereHas('product', function ($q) {
                $q->whereColumn('reorder_level', '>=', 'current_quantity');  // reorder_level >= current_quantity from stock_batches... we need to join
            })
            ->get()
            ->filter(function ($batch) {
                return $batch->current_quantity <= $batch->product?->reorder_level;
            })
            ->count();

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
        $lowStockAlerts = StockBatches::with('product')
            ->where('current_quantity', '>', 0)
            ->get()
            ->filter(function ($batch) {
                return $batch->current_quantity <= ($batch->product?->reorder_level ?? 0);
            })
            ->take(5)
            ->map(function ($batch) {
                return [
                    'name'          => $batch->product?->generic_name,
                    'stock'         => $batch->current_quantity,
                    'reorder_level' => $batch->product?->reorder_level,
                    'batch_number'  => $batch->batch_number,
                    'expiry_date'   => $batch->expiry_date,
                ];
            })
            ->values();

        // ── Monthly Chart (last 12 months) ──
        $monthlyData = [];
        for ($i = 11; $i >= 0; $i--) {
            $month      = $now->copy()->subMonths($i);
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
            ],
            'month' => [
                'revenue'        => $monthRevenue,
                'invoices'       => $monthInvoices,
                'revenue_trend'  => $monthRevTrend,
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
