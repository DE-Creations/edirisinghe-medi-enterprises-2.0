<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Payment;

class ReceivableController extends Controller
{
    // get all invoices with payment infomations
    public function invoices() {

        $invoices = Invoice::with(['customer', 'user'])
            ->latest()
            ->get()
            ->map(function ($inv) {
                $collected = Payment::where('reference_type', 'invoice')
                    ->where('reference_id', $inv->id)
                    ->sum('amount');

                // Also include paid_amount from invoice itself
                $totalCollected = $inv->paid_amount + $collected;
                $outstanding = max(0, $inv->grand_total - $totalCollected);

                return [
                    'id'             => $inv->id,
                    'invoice_number' => $inv->invoice_number,
                    'invoice_date'   => $inv->invoice_date,
                    'customer'       => $inv->customer?->name ?? 'Walk-in Customer',
                    'grand_total'    => $inv->grand_total,
                    'paid_amount'    => $inv->paid_amount,
                    'collected'      => $totalCollected,
                    'outstanding'    => $outstanding,
                    'status'         => $outstanding <= 0 ? 'paid' : ($totalCollected > 0 ? 'partial' : 'unpaid'),
                ];
            });

        return response()->json($invoices);        
    }

    // get payment history for invoice
    public function paymentHistory($id) {

        $payments = Payment::where('reference_type', 'invoice')
            ->where('reference_id', $id)
            ->with('user')
            ->latest()
            ->get();

        return response()->json($payments);
    }

    // record payment received
    public function recordPayment(Request $request) {

        $validated = $request->validate([
            'reference_id' => 'required|exists:invoices,id',
            'amount'       => 'required|numeric|min:0.01',
            'date'         => 'required|date',
            'notes'        => 'nullable|string',
            'user_id'      => 'required|exists:users,id',
        ]);

        $invoice = Invoice::findOrFail($validated['reference_id']);     
        
        // Calculate outstanding
        $collected = Payment::where('reference_type', 'invoice')
            ->where('reference_id', $invoice->id)
            ->sum('amount');
        $totalCollected = $invoice->paid_amount + $collected;
        $outstanding = $invoice->grand_total - $totalCollected;

        if ($validated['amount'] > $outstanding) {
            return response()->json([
                'message' => "Payment exceeds outstanding amount of Rs. {$outstanding}"
            ], 422);
        }  
        
        $payment = Payment::create([
            'reference_type' => 'invoice',
            'reference_id'   => $validated['reference_id'],
            'amount'         => $validated['amount'],
            'date'           => $validated['date'],
            'notes'          => $validated['notes'] ?? null,
            'user_id'        => $validated['user_id'],
        ]);

        return response()->json($payment, 201);        
    }
}
