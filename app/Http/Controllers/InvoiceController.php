<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Models\Invoice;
use App\Models\InvoiceItems;
use App\Models\StockBatches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function nextNumber() {

        $last = Invoice::withTrashed()->latest()->first();
        $next = $last ? ($last->id + 1) : 1;
        return response()->json([
            'invoice_number' => 'INV-' . str_pad($next, 4, '0', STR_PAD_LEFT)
        ]);
    }

    public function formData() {

        try {

            $customers = Customers::all(['id', 'name', 'is_vat']);
            
            // Get products that have stock available
            $stock = StockBatches::with(['product.brand', 'product.category'])
                ->where('current_quantity', '>', 0)
                ->get()
                ->map(function ($batch) {
                    return [
                        'stock_batch_id'   => $batch->id,
                        'product_id'       => $batch->product?->id,
                        'generic_name'     => $batch->product?->generic_name,
                        'barcode_value'    => $batch->product?->barcode_value,
                        'brand'            => $batch->product?->brand?->name,
                        'category'         => $batch->product?->category?->name,
                        'selling_price'    => $batch->selling_price,
                        'current_quantity' => $batch->current_quantity,
                        'expiry_date'      => $batch->expiry_date,
                        'batch_number'     => $batch->batch_number,
                    ];
                });

            return response()->json([
                'customers' => $customers,
                'stock'     => $stock,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function all() {

        $invoices = Invoice::with(['customer', 'user', 'items.stockBatch.product'])
            ->latest()
            ->get();
        return response()->json($invoices);
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'customer_id'        => 'required|exists:customers,id',
            'user_id'            => 'required|exists:users,id',
            'invoice_date'       => 'required|date',
            'sub_total'          => 'required|numeric',
            'discount'           => 'required|numeric|min:0',
            'grand_total'        => 'required|numeric',
            'paid_amount'        => 'required|numeric|min:0',
            'payment_method'     => 'required|in:cash,card,cheque',
            'items'              => 'required|array|min:1',
            'items.*.stock_batch_id' => 'required|exists:stock_batches,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);  
        
        // Payment status
        $status = 'unpaid';
        if ($validated['paid_amount'] >= $validated['grand_total']) {
            $status = 'paid';
        } elseif ($validated['paid_amount'] > 0) {
            $status = 'partial';
        }  
        
        DB::transaction(function () use ($validated, $status) {

            $last   = Invoice::withTrashed()->latest()->first();
            $next   = $last ? ($last->id + 1) : 1;
            $invNum = 'INV-' . str_pad($next, 4, '0', STR_PAD_LEFT);  
            
            $invoice = Invoice::create([
                'invoice_number' => $invNum,
                'customer_id'    => $validated['customer_id'],
                'user_id'        => $validated['user_id'],
                'invoice_date'   => $validated['invoice_date'],
                'sub_total'      => $validated['sub_total'],
                'discount'       => $validated['discount'],
                'grand_total'    => $validated['grand_total'],
                'paid_amount'    => $validated['paid_amount'],
                'payment_method' => $validated['payment_method'],
                'status'         => $status,
            ]);

            // Create invoice items and update stock batches
            foreach ($validated['items'] as $item) {
                InvoiceItems::create([
                    'invoice_id'     => $invoice->id,
                    'stock_batch_id' => $item['stock_batch_id'],
                    'quantity'       => $item['quantity'],
                    'unit_price'     => $item['unit_price'],
                ]);

                $batch = StockBatches::findOrFail($item['stock_batch_id']);
                $newQty = $batch->current_quantity - $item['quantity'];
                if ($newQty < 0) {
                    throw new \Exception("Insufficient stock for: " . $batch->product?->generic_name);
                }
                $batch->update(['current_quantity' => $newQty]);                
            }

            return response()->json(['message' => 'Invoice saved successfully'], 201);
        });
    }

    public function delete($id) {

        $invoice = Invoice::findOrFail($id);
        $invoice->items()->delete();
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted']);
    }
}
