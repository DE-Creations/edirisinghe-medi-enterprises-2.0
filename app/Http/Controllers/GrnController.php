<?php

namespace App\Http\Controllers;

use App\Models\Grn;
use App\Models\Grn_items;
use App\Models\StockBatches;
use App\Models\Product;
use App\Models\Suppliers;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class GrnController extends Controller
{

    public function nextNumber()
    {

        $last = Grn::withTrashed()->latest()->first();
        $next = $last ? ($last->id + 1) : 1;
        return response()->json([
            'grn_number' => 'GRN-' . str_pad($next, 4, '0', STR_PAD_LEFT)
        ]);
    }

    // public function formData()
    // {
    //     try {
    //         $suppliers = Suppliers::all(['id', 'name']);
    //         $products = Product::with(['brand', 'category'])
    //             ->withSum('stockBatches', 'current_quantity')
    //             ->get();
    //         return response()->json([
    //             'suppliers' => $suppliers,
    //             'products' => $products
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'error' => $e->getMessage(),
    //             'line'  => $e->getLine(),
    //             'file'  => $e->getFile(),
    //         ], 500);
    //     }
    // }

    public function formData() {

        try {
            $suppliers = \App\Models\Suppliers::all(['id', 'name']);
            $products  = Product::with(['brand', 'category'])->get();
            $categories = \App\Models\Categories::all(['id', 'name']);
            $brands     = \App\Models\Brands::all(['id', 'name']);
            $unitTypes  = \App\Models\UnitTypes::all(['id', 'name']);

            return response()->json([
                'suppliers'  => $suppliers,
                'products'   => $products,
                'categories' => $categories,
                'brands'     => $brands,
                'unit_types' => $unitTypes,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function all() {
        
        try {
            $grns = Grn::with(['supplier', 'user', 'items.product'])
                ->latest()
                ->get()
                ->map(function ($grn) {

                    $paymentsPaid = Payment::where('reference_type', 'grn')
                        ->where('reference_id', $grn->id)
                        ->sum('amount');

                    $totalPaid   = $grn->paid_amount + $paymentsPaid;
                    $outstanding = max(0, $grn->total_amount - $totalPaid);

                    $status = 'unpaid';
                    if ($totalPaid >= $grn->total_amount) $status = 'paid';
                    elseif ($totalPaid > 0)               $status = 'partial';

                    $paymentRecords = Payment::where('reference_type', 'grn')
                        ->where('reference_id', $grn->id)
                        ->with('user')
                        ->latest()
                        ->get()
                        ->map(fn($p) => [
                            'id'     => $p->id,
                            'date'   => $p->date,
                            'amount' => $p->amount,
                            'notes'  => $p->notes,
                            'by'     => $p->user?->name,
                        ]);

                    return [
                        'id'                  => $grn->id,
                        'grn_number'          => $grn->grn_number,
                        'received_date'       => $grn->received_date,
                        'supplier_invoice_no' => $grn->supplier_invoice_no,
                        'supplier'            => $grn->supplier,
                        'user'                => $grn->user,
                        'sub_total'           => $grn->sub_total,
                        'discount'            => $grn->discount,
                        'total_amount'        => $grn->total_amount,
                        'initial_paid'        => $grn->paid_amount,
                        'total_paid'          => $totalPaid,
                        'outstanding'         => $outstanding,
                        'payment_method'      => $grn->payment_method,
                        'payment_status'      => $status,
                        'items'               => $grn->items,
                        'payment_records'     => $paymentRecords,
                    ];
                });

            return response()->json($grns);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line'  => $e->getLine(),
                'file'  => $e->getFile(),
            ], 500);
        }
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'supplier_id'            => 'required|exists:suppliers,id',
            'supplier_invoice_no'    => 'nullable|string',
            'received_date'          => 'required|date',
            'sub_total'              => 'required|numeric',
            'discount'               => 'required|numeric|min:0',
            'total_amount'           => 'required|numeric',
            'paid_amount'            => 'required|numeric|min:0',
            'payment_method'         => 'required|in:cash,card,cheque',
            'notes'                  => 'nullable|string',
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|exists:products,id',
            'items.*.quantity'       => 'required|integer|min:1',
            'items.*.unit_price'     => 'required|numeric|min:0',
            'items.*.selling_price'  => 'required|numeric|min:0',
            'items.*.batch_number'   => 'nullable|string',
            'items.*.expiry_date'    => 'nullable|date',
            'items.*.mfd_date'       => 'nullable|date',
        ]);

        // Calculate payment status
        $status = 'unpaid';
        if ($validated['paid_amount'] >= $validated['total_amount']) {
            $status = 'paid';
        } elseif ($validated['paid_amount'] > 0) {
            $status = 'partial';
        }

        DB::transaction(function () use ($validated, $status) {

            $last   = Grn::withTrashed()->latest()->first();
            $next   = $last ? ($last->id + 1) : 1;
            $grnNum = 'GRN-' . str_pad($next, 4, '0', STR_PAD_LEFT);

            $userId = Auth::id();

            $grn = Grn::create([
                'grn_number'          => $grnNum,
                'supplier_id'         => $validated['supplier_id'],
                'user_id'             => $userId,
                'supplier_invoice_no' => $validated['supplier_invoice_no'] ?? null,
                'received_date'       => $validated['received_date'],
                'sub_total'           => $validated['sub_total'],
                'discount'            => $validated['discount'],
                'total_amount'        => $validated['total_amount'],
                'paid_amount'         => $validated['paid_amount'],
                'payment_method'      => $validated['payment_method'],
                'payment_status'      => $status,
                'notes'               => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {

                Grn_items::create([
                    'grn_id'        => $grn->id,
                    'product_id'    => $item['product_id'],
                    'quantity'      => $item['quantity'],
                    'unit_price'    => $item['unit_price'],
                    'selling_price' => $item['selling_price'],
                    'batch_number'  => $item['batch_number'] ?? null,
                    'expiry_date'   => $item['expiry_date'] ?? null,
                    'mfd_date'      => $item['mfd_date'] ?? null,
                ]);

                StockBatches::create([
                    'product_id'       => $item['product_id'],
                    'grn_id'           => $grn->id,
                    'user_id'          => $userId,
                    'batch_number'     => $item['batch_number'] ?? null,
                    'mfd'              => $item['mfd_date'] ?? null,
                    'expiry_date'      => $item['expiry_date'] ?? null,
                    'purchase_price'   => $item['unit_price'],
                    'selling_price'    => $item['selling_price'],
                    'initial_quantity' => $item['quantity'],
                    'current_quantity' => $item['quantity'],
                ]);
            }
        });

        return response()->json(['message' => 'GRN saved successfully'], 201);
    }

    public function delete($id)
    {

        $grn = Grn::findOrFail($id);
        $grn->items()->delete();
        $grn->delete();
        return response()->json(['message' => 'GRN deleted']);
    }
}
