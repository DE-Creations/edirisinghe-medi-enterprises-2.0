<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Receivable;

class ReceivableController extends Controller
{
    public function invoices() {

        $invoices = Invoice::with(['customer', 'receivables'])
            ->latest()
            ->get()
            ->map(function ($inv) {
                $collected   = $inv->receivables->sum('amount');
                $outstanding = max(0, $inv->grand_total - $collected);

                return [
                    'id'             => $inv->id,
                    'invoice_number' => $inv->invoice_number,
                    'invoice_date'   => $inv->invoice_date,
                    'customer'       => $inv->customer?->name ?? 'Walk-in Customer',
                    'grand_total'    => $inv->grand_total,
                    'paid_amount'    => $inv->paid_amount,
                    'collected'      => $collected,
                    'outstanding'    => $outstanding,
                    'status'         => $inv->status,
                ];
            });

        return response()->json($invoices);
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
