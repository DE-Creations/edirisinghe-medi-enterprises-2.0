<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grn;
use App\Models\Payment;
use App\Models\Expense;

class PayableController extends Controller
{
    // get all GRNs with payment infomations
    public function grns() {
        $grns = Grn::with(['supplier'])
            ->latest()
            ->get()
            ->map(function ($grn) {
                $paid = Payment::where('reference_type', 'grn')
                    ->where('reference_id', $grn->id)
                    ->sum('amount');
                $outstanding = max(0, $grn->total_amount - $paid);
                return [
                    'id'           => $grn->id,
                    'grn_number'   => $grn->grn_number,
                    'received_date'=> $grn->received_date,
                    'supplier'     => $grn->supplier?->name,
                    'total_amount' => $grn->total_amount,
                    'paid'         => $paid,
                    'outstanding'  => $outstanding,
                    'status'       => $outstanding <= 0 ? 'paid' : ($paid > 0 ? 'partial' : 'unpaid'),
                ];
            });

        return response()->json($grns);    
    }

    // get all expenses
    public function expenses() {
        $expenses = Expense::latest()->get()->map(function ($exp) {
            $paid = Payment::where('reference_type', 'expense')
                ->where('reference_id', $exp->id)
                ->sum('amount');
            $outstanding = max(0, $exp->amount - $paid);
            return [
                'id'             => $exp->id,
                'expense_number' => $exp->expense_number,
                'date'           => $exp->date,
                'description'    => $exp->description,
                'category'       => $exp->category,
                'amount'         => $exp->amount,
                'paid'           => $paid,
                'outstanding'    => $outstanding,
                'notes'          => $exp->notes,
                'status'         => $outstanding <= 0 ? 'paid' : ($paid > 0 ? 'partial' : 'unpaid'),
            ];
        });

        return response()->json($expenses);
    }

    // get payment history for a reference
    public function paymentHistory($type, $id) {
        $payments = Payment::where('reference_type', $type)
            ->where('reference_id', $id)
            ->with('user')
            ->latest()
            ->get();
        return response()->json($payments);
    } 
    
    // add expense
    public function storeExpense(Request $request) {

        $validated = $request->validate([
            'date'        => 'required|date',
            'description' => 'required|string',
            'category'    => 'required|string',
            'amount'      => 'required|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'notes'       => 'nullable|string',
            'user_id'     => 'required|exists:users,id',
        ]);

        // expense number
        $last = Expense::withTrashed()->latest()->first();
        $next = $last ? ($last->id + 1) : 1;
        $expNumber = 'EXP-' . str_pad($next, 4, '0', STR_PAD_LEFT);

        // paid amount and status
        $paidAmount = $validated['paid_amount'] ?? 0;
        $status = 'unpaid';
        if ($paidAmount >= $validated['amount']) $status = 'paid';
        elseif ($paidAmount > 0) $status = 'partial';

        $expense = Expense::create([
            'expense_number' => $expNumber,
            'date'           => $validated['date'],
            'description'    => $validated['description'],
            'category'       => $validated['category'],
            'amount'         => $validated['amount'],
            'paid_amount'    => $paidAmount,
            'status'         => $status,
            'notes'          => $validated['notes'] ?? null,
            'user_id'        => $validated['user_id'],
        ]);

        // If paid amount > 0, create payment record
        if ($paidAmount > 0) {
            Payment::create([
                'reference_type' => 'expense',
                'reference_id'   => $expense->id,
                'amount'         => $paidAmount,
                'date'           => $validated['date'],
                'notes'          => 'Initial payment on creation',
                'user_id'        => $validated['user_id'],
            ]);
        }

        return response()->json($expense, 201);
    }   
    
    public function deleteExpense($id) {

        $expense = Expense::findOrFail($id);
        Payment::where('reference_type', 'expense')
               ->where('reference_id', $id)
               ->delete();
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

        // Calculate total paid so far
        $totalPaid = Payment::where('reference_type', $validated['reference_type'])
            ->where('reference_id', $validated['reference_id'])
            ->sum('amount');

        if ($validated['reference_type'] === 'grn') {
            $ref = Grn::findOrFail($validated['reference_id']);
            $total = $ref->total_amount;
        } else {
            $ref = Expense::findOrFail($validated['reference_id']);
            $total = $ref->amount;
        }  
        
        $outstanding = $total - $totalPaid;
        if ($validated['amount'] > $outstanding) {
            return response()->json([
                'message' => "Payment exceeds outstanding amount of Rs. {$outstanding}"
            ], 422);
        } 
        
        $payment = Payment::create($validated);

        return response()->json($payment, 201);        
    }
}
