<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;

class NotificationController extends Controller
{
    public function overdueInvoices(Request $request)
    {
        $page = (int) $request->get('page', 1);
        $perPage = 10;

        $query = Invoice::with('customer:id,name')
            ->whereIn('status', ['unpaid', 'partial'])
            ->whereDate('invoice_date', '<=', now()->subDays(30))
            ->latest('invoice_date');

        $total = $query->count();
        $items = $query->forPage($page, $perPage)->get();

        $data = $items->map(fn($inv) => [
            'id'             => $inv->id,
            'invoice_number' => $inv->invoice_number,
            'invoice_date'   => $inv->invoice_date,
            'customer'       => $inv->customer?->name ?? 'Walk-in Customer',
            'grand_total'    => $inv->grand_total,
            'paid_amount'    => $inv->paid_amount,
            'outstanding'    => max(0, $inv->grand_total - $inv->paid_amount),
            'days_overdue'   => (int) now()->diffInDays($inv->invoice_date),
            'status'         => $inv->status,
        ]);

        return response()->json([
            'data'         => $data,
            'total'        => $total,
            'current_page' => $page,
            'last_page'    => (int) ceil($total / $perPage),
        ]);
    }
}
