<?php

namespace App\Http\Controllers;

use App\Models\Grn;
use App\Models\GrnItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GrnController extends Controller {

    public function nextNumber() {
        $last = Grn::withTrashed()->latest()->first();
        $next = $last ? (intval(substr($last->grn_number, 4)) + 1) : 1;
        return response()->json(['grn_number' => 'GRN-' . str_pad($next, 4, '0', STR_PAD_LEFT)]);
    }

    public function all() {
        $grns = Grn::with(['supplier', 'items.product'])->latest()->get();
        return response()->json($grns);
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'supplier_id'         => 'required|exists:suppliers,id',
            'employee_id'         => 'required|exists:employees,id',
            'received_date'       => 'required|date',
            'supplier_invoice_no' => 'nullable|string',
            'sub_total'           => 'required|numeric',
            'discount'            => 'required|numeric|min:0',
            'total_amount'        => 'required|numeric',
            'paid_amount'         => 'required|numeric|min:0',
            'payment_method'      => 'required|in:cash,card,cheque',
            'notes'               => 'nullable|string',
            'items'               => 'required|array|min:1',
            'items.*.product_id'  => 'required|exists:products,id',
            'items.*.quantity'    => 'required|integer|min:1',
            'items.*.unit_price'  => 'required|numeric|min:0',
        ]);

        $paymentStatus = 'unpaid';
        if ($validated['paid_amount'] >= $validated['total_amount']) {
            $paymentStatus = 'paid';
        } elseif ($validated['paid_amount'] > 0) {
            $paymentStatus = 'partial';
        }

        DB::transaction(function () use ($validated, $paymentStatus) {

            $last = Grn::withTrashed()->latest()->first();
            $next = $last ? (intval(substr($last->grn_number, 4)) + 1) : 1;
            $grnNumber = 'GRN-' . str_pad($next, 4, '0', STR_PAD_LEFT);

            $grn = Grn::create([
                'grn_number'          => $grnNumber,
                'supplier_id'         => $validated['supplier_id'],
                'employee_id'         => $validated['employee_id'],
                'supplier_invoice_no' => $validated['supplier_invoice_no'],
                'received_date'       => $validated['received_date'],
                'sub_total'           => $validated['sub_total'],
                'discount'            => $validated['discount'],
                'total_amount'        => $validated['total_amount'],
                'paid_amount'         => $validated['paid_amount'],
                'payment_method'      => $validated['payment_method'],
                'payment_status'      => $paymentStatus,
            ]);

            foreach ($validated['items'] as $item) {

                GrnItem::create([
                    'grn_id'        => $grn->id,
                    'product_id'    => $item['product_id'],
                    'quantity'      => $item['quantity'],
                    'unit_price'    => $item['unit_price'],
                    'selling_price' => $item['selling_price'],
                    'batch_number'  => $item['batch_number'] ?? null,
                    'expiry_date'   => $item['expiry_date'] ?? null,
                    'mfd_date'      => $item['mfd_date'] ?? null,
                ]);

                StockBatch::create([
                    'product_id'       => $item['product_id'],
                    'grn_id'           => $grn->id,
                    'batch_number'     => $item['batch_number'] ?? null,
                    'expiry_date'      => $item['expiry_date'] ?? null,
                    'mfd_date'         => $item['mfd_date'] ?? null,
                    'purchase_price'   => $item['unit_price'],
                    'selling_price'    => $item['selling_price'],
                    'initial_quantity' => $item['quantity'],
                    'current_quantity' => $item['quantity'], 
                ]);
            }
        });

        return response()->json(['message' => 'GRN saved successfully'], 201);
    }

    public function delete($id) {
        $grn = Grn::findOrFail($id);
        $grn->items()->delete();
        $grn->delete();
        return response()->json(['message' => 'GRN deleted']);
    }
}
