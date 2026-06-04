<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grn;
use App\Models\Expense;
use App\Models\Payable;

class PayableController extends Controller
{
    // get all GRNs with payment information
    public function grns() {
        $grns = Grn::with(['supplier', 'payables'])
            ->latest()
            ->get()
            ->map(function ($grn) {
                // Use payable table as source of truth; fall back to grn.paid_amount for old GRNs
                $payablesSum = $grn->payables->sum('amount');
                $totalPaid   = $payablesSum > 0 ? $payablesSum : $grn->paid_amount;
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

        return response()->json($grns);    
    }

    // get all expenses
    public function expenses() {
        $expenses = Expense::with('category')->latest()->get()->map(function ($exp) {
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

        return response()->json($expenses);
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
