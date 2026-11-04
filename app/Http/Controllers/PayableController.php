<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Grn;
use App\Models\Expense;
use App\Models\Payable;

class PayableController extends Controller
{
    // Payments made against a GRN. The payable table is the source of truth;
    // old GRNs without payable rows fall back to grns.paid_amount.
    private const GRN_PAYABLES_SUM_SQL = '(select coalesce(sum(p.amount), 0) from payable p where p.grns_id = grns.id)';
    private const GRN_PAID_SQL = '(case when (select coalesce(sum(p.amount), 0) from payable p where p.grns_id = grns.id) > 0
        then (select sum(p.amount) from payable p where p.grns_id = grns.id)
        else coalesce(grns.paid_amount, 0) end)';

    /**
     * Paginated GRN list for the GRN Payables tab.
     *
     * - tab: all | outstanding | paid (outstanding = total_amount > paid)
     * - search: GRN number or supplier name; searching looks through all dates
     * - without a search the list is limited to the last 3 months, except the
     *   Outstanding tab, which always shows every unpaid GRN regardless of age
     * - meta carries the all-time totals and the per-tab counts for the summary cards
     */
    public function grns(Request $request) {

        $search = trim((string) $request->input('search', ''));
        $tab    = in_array($request->input('tab'), ['all', 'outstanding', 'paid'], true)
            ? $request->input('tab')
            : 'all';

        $paid  = self::GRN_PAID_SQL;
        $since = now()->subMonths(3)->startOfDay();

        $scope = function ($query, string $forTab) use ($search, $paid, $since) {
            if ($search !== '') {
                $query->where(function ($q) use ($search) {
                    $q->where('grn_number', 'like', "%{$search}%")
                      ->orWhereHas('supplier', fn ($s) => $s->where('name', 'like', "%{$search}%"));
                });
            }

            if ($forTab === 'outstanding') {
                $query->whereRaw("grns.total_amount > {$paid}");
            } elseif ($forTab === 'paid') {
                $query->whereRaw("grns.total_amount <= {$paid}");
            }

            if ($search === '' && $forTab !== 'outstanding') {
                $query->where('received_date', '>=', $since);
            }

            return $query;
        };

        $paginator = $scope(
                Grn::with('supplier')
                    ->select('grns.*')
                    ->selectRaw("{$paid} as paid_calc"),
                $tab
            )
            ->latest()
            ->orderByDesc('id')
            ->paginate(20)
            ->through(function ($grn) {
                $totalPaid   = (float) $grn->paid_calc;
                $outstanding = max(0, $grn->total_amount - $totalPaid);
                return [
                    'id'           => $grn->id,
                    'grn_number'   => $grn->grn_number,
                    'received_date'=> $grn->received_date,
                    'supplier'     => $grn->supplier?->name,
                    'total_amount' => $grn->total_amount,
                    'paid'         => $totalPaid,
                    'outstanding'  => $outstanding,
                    'status'       => $outstanding <= 0 ? 'paid' : ($totalPaid > 0 ? 'partial' : 'unpaid'),
                ];
            });

        // All-time totals for the summary cards (independent of search / tab / window).
        $totals = DB::table('grns')
            ->whereNull('deleted_at')
            ->selectRaw("
                coalesce(sum(total_amount), 0) as total_payable,
                coalesce(sum(greatest(total_amount - {$paid}, 0)), 0) as total_outstanding
            ")
            ->first();

        return response()->json(array_merge($paginator->toArray(), [
            'meta' => [
                'total_payable'     => (float) $totals->total_payable,
                'total_outstanding' => (float) $totals->total_outstanding,
                'counts' => [
                    'all'         => $scope(Grn::query(), 'all')->count(),
                    'outstanding' => $scope(Grn::query(), 'outstanding')->count(),
                    'paid'        => $scope(Grn::query(), 'paid')->count(),
                ],
            ],
        ]));
    }

    /**
     * Paginated expense list. Searching (expense no., description, category) looks
     * through all dates; without a search only the last 3 months are listed.
     * meta.total_expenses is the all-time total for the summary card.
     */
    public function expenses(Request $request) {

        $search = trim((string) $request->input('search', ''));

        $query = Expense::with('category')->latest()->orderByDesc('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('expense_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('category', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            });
        } else {
            $query->where('date', '>=', now()->subMonths(3)->startOfDay()->toDateString());
        }

        $paginator = $query->paginate(20)->through(function ($exp) {
            return [
                'id'             => $exp->id,
                'expense_number' => $exp->expense_number,
                'date'           => $exp->date,
                'description'    => $exp->description,
                'category'       => $exp->category?->name ?? '—',
                'amount'         => $exp->amount,
                'notes'          => $exp->notes,
            ];
        });

        return response()->json(array_merge($paginator->toArray(), [
            'meta' => ['total_expenses' => (float) Expense::sum('amount')],
        ]));
    }

    // get payment history for a reference
    public function paymentHistory($type, $id) {
        if ($type === 'grn') {
            $payments = Payable::where('grns_id', $id)
                ->oldest('dateTime')
                ->get()
                ->map(fn ($p) => [
                    'id'     => $p->id,
                    'amount' => $p->amount,
                    'date'   => $p->dateTime,
                    'notes'  => $p->note,
                    'user'   => null,
                ]);
        } else {
            // Expenses track paid_amount directly — no separate payment log
            $payments = collect([]);
        }
        return response()->json($payments);
    } 
    
    // add expense
    public function storeExpense(Request $request) {

        $validated = $request->validate([
            'date'        => 'required|date',
            'description' => 'required|string',
            'category_id' => 'required|exists:expenses_category,id',
            'amount'      => 'required|numeric|min:0',
            'notes'       => 'nullable|string',
            'user_id'     => 'required|exists:users,id',
        ]);

        // expense number
        $last = Expense::withTrashed()->latest()->first();
        $next = $last ? ($last->id + 1) : 1;
        $expNumber = 'EXP-' . str_pad($next, 4, '0', STR_PAD_LEFT);

        $expense = Expense::create([
            'expense_number' => $expNumber,
            'date'           => $validated['date'],
            'description'    => $validated['description'],
            'category_id'    => $validated['category_id'],
            'amount'         => $validated['amount'],
            'notes'          => $validated['notes'] ?? null,
            'user_id'        => $validated['user_id'],
        ]);

        return response()->json($expense, 201);
    }

    public function nextExpenseNumber() {
        $last = Expense::withTrashed()->latest()->first();
        $next = $last ? ($last->id + 1) : 1;
        return response()->json(['number' => 'EXP-' . str_pad($next, 4, '0', STR_PAD_LEFT)]);
    }   
    
    public function deleteExpense($id) {

        $expense = Expense::findOrFail($id);
        $expense->delete();
        return response()->json(['message' => 'Expense deleted']);
    }

    // record payment for GRN and Expense
    public function recordPayment(Request $request) {

        $validated = $request->validate([
            'reference_type' => 'required|in:grn,expense',
            'reference_id'   => 'required|integer',
            'amount'         => 'required|numeric|min:0.01',
            'date'           => 'required|date',
            'notes'          => 'nullable|string',
            'user_id'        => 'required|exists:users,id',
        ]);

        if ($validated['reference_type'] === 'grn') {
            $ref = Grn::findOrFail($validated['reference_id']);
            $total = $ref->total_amount;
            $initialPaid = $ref->paid_amount;
        } else {
            return response()->json(['message' => 'Expenses do not support additional payments.'], 422);
        }

        // Calculate total paid — GRN uses payable table
        $payablesSum = Payable::where('grns_id', $validated['reference_id'])->sum('amount');
        $totalPaid   = $payablesSum > 0 ? $payablesSum : $initialPaid;

        $outstanding = $total - $totalPaid;
        if ($validated['amount'] > $outstanding) {
            return response()->json([
                'message' => "Payment exceeds outstanding amount of Rs. {$outstanding}"
            ], 422);
        }

        $grn          = $ref;
        $newTotalPaid = $totalPaid + $validated['amount'];
        $newStatus    = $newTotalPaid >= $grn->total_amount ? 'paid' : 'partial';
        $grn->update(['payment_status' => $newStatus]);

        $payable = Payable::create([
            'grns_id'  => $validated['reference_id'],
            'amount'   => $validated['amount'],
            'dateTime' => $validated['date'],
            'note'     => $validated['notes'] ?? 'Additional Payment',
        ]);

        return response()->json($payable, 201);
    }
}
