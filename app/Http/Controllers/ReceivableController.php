<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Invoice;
use App\Models\Receivable;

class ReceivableController extends Controller
{
    // Sum of payments received for an invoice (the receivable table is the source of truth).
    private const COLLECTED_SQL = '(select coalesce(sum(r.amount), 0) from receivable r where r.invoice_id = invoices.id)';

    /**
     * Paginated invoice list for the Receivables screen.
     *
     * - tab: all | outstanding | paid (outstanding = grand_total > collected)
     * - search: invoice number or customer name; searching looks through all dates
     * - without a search the list is limited to the last 3 months, except the
     *   Outstanding tab, which always shows every unpaid invoice regardless of age
     * - meta carries the all-time totals and the per-tab counts for the summary cards
     */
    public function invoices(Request $request) {

        $search = trim((string) $request->input('search', ''));
        $tab    = in_array($request->input('tab'), ['all', 'outstanding', 'paid'], true)
            ? $request->input('tab')
            : 'all';

        $collected = self::COLLECTED_SQL;
        $since     = now()->subMonths(3)->startOfDay()->toDateString();

        // Shared constraints for a given tab: search, outstanding/paid, 3-month window.
        $scope = function ($query, string $forTab) use ($search, $collected, $since) {
            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('invoice_number', 'like', "%{$search}%")
                      ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', "%{$search}%"));
                    // Invoices without a customer are shown as "Walk-in Customer".
                    if (stripos('Walk-in Customer', $search) !== false) {
                        $q->orWhereNull('customer_id');
                    }
                });
            }

            if ($forTab === 'outstanding') {
                $query->whereRaw("invoices.grand_total > {$collected}");
            } elseif ($forTab === 'paid') {
                $query->whereRaw("invoices.grand_total <= {$collected}");
            }

            if ($search === '' && $forTab !== 'outstanding') {
                $query->where('invoice_date', '>=', $since);
            }

            return $query;
        };

        $paginator = $scope(
                Invoice::with('customer')
                    ->select('invoices.*')
                    ->selectRaw("{$collected} as collected_sum"),
                $tab
            )
            ->latest()
            ->orderByDesc('id')
            ->paginate(20)
            ->through(function ($inv) {
                $collectedAmount = (float) $inv->collected_sum;
                $outstanding     = max(0, $inv->grand_total - $collectedAmount);

                return [
                    'id'             => $inv->id,
                    'invoice_number' => $inv->invoice_number,
                    'invoice_date'   => $inv->invoice_date,
                    'customer'       => $inv->customer?->name ?? 'Walk-in Customer',
                    'grand_total'    => $inv->grand_total,
                    'paid_amount'    => $inv->paid_amount,
                    'collected'      => $collectedAmount,
                    'outstanding'    => $outstanding,
                    'status'         => $inv->status,
                ];
            });

        // All-time totals for the summary cards (independent of search / tab / window).
        $totals = DB::table('invoices')
            ->whereNull('deleted_at')
            ->selectRaw("
                coalesce(sum(grand_total), 0) as total_invoiced,
                coalesce(sum({$collected}), 0) as total_collected,
                coalesce(sum(greatest(grand_total - {$collected}, 0)), 0) as total_outstanding
            ")
            ->first();

        return response()->json(array_merge($paginator->toArray(), [
            'meta' => [
                'total_invoiced'    => (float) $totals->total_invoiced,
                'total_collected'   => (float) $totals->total_collected,
                'total_outstanding' => (float) $totals->total_outstanding,
                'counts' => [
                    'all'         => $scope(Invoice::query(), 'all')->count(),
                    'outstanding' => $scope(Invoice::query(), 'outstanding')->count(),
                    'paid'        => $scope(Invoice::query(), 'paid')->count(),
                ],
            ],
        ]));
    }

    public function paymentHistory($id) {

        $records = Receivable::where('invoice_id', $id)
            ->orderByDesc('dateTime')
            ->get(['id', 'amount', 'dateTime', 'note']);

        return response()->json($records);
    }

    public function recordPayment(Request $request) {

        $validated = $request->validate([
            'reference_id' => 'required|exists:invoices,id',
            'amount'       => 'required|numeric|min:0.01',
            'date'         => 'required|date',
            'notes'        => 'nullable|string',
            'user_id'      => 'required|exists:users,id',
        ]);

        $invoice = Invoice::findOrFail($validated['reference_id']);

        $collected   = $invoice->receivables()->sum('amount');
        $outstanding = $invoice->grand_total - $collected;

        if ($validated['amount'] > $outstanding) {
            return response()->json([
                'message' => "Payment exceeds outstanding amount of Rs. {$outstanding}"
            ], 422);
        }

        $receivable = Receivable::create([
            'invoice_id' => $validated['reference_id'],
            'amount'     => $validated['amount'],
            'dateTime'   => $validated['date'],
            'note'       => $validated['notes'] ?? 'Additional Payment',
        ]);

        $newCollected = $collected + $validated['amount'];
        $newStatus    = $newCollected >= $invoice->grand_total ? 'paid' : 'partial';
        $invoice->update(['status' => $newStatus]);

        return response()->json($receivable, 201);
    }
}
