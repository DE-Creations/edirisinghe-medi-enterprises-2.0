<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StockBatches;
use App\Models\InventoryAdjustment;

class StockController extends Controller
{
    public function all() {

        $stock = StockBatches::with([
                'product.category',
                'product.brand',
                'grn',
            ])
            ->get()
            ->map(function ($batch) {
                return [
                    'id'               => $batch->id,
                    'batch_number'     => $batch->batch_number,
                    'mfd'              => $batch->mfd,
                    'expiry_date'      => $batch->expiry_date,
                    'purchase_price'   => $batch->purchase_price,
                    'initial_quantity' => $batch->initial_quantity,
                    'current_quantity' => $batch->current_quantity,
                    'grn_number'       => $batch->grn?->grn_number,
                    'product' => [
                        'id'           => $batch->product?->id,
                        'generic_name' => $batch->product?->generic_name,
                        'reorder_level'=> $batch->product?->reorder_level,
                        'category'     => $batch->product?->category?->name,
                        'brand'        => $batch->product?->brand?->name,
                    ],
                ];
            });

        return response()->json($stock);
    }

    public function adjustments($batchId) {

        $adjustments = InventoryAdjustment::where('stock_batch_id', $batchId)
            ->with('user')
            ->latest()
            ->get();
        return response()->json($adjustments);
    }

    public function adjust(Request $request, $batchId) {

        $validated = $request->validate([
            'quantity'    => 'required|integer|not_in:0',
            'type'        => 'required|in:sample,gift,damage,expiry,correction,other',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'user_id'     => 'required|exists:users,id',
        ]);        

        $batch = StockBatches::findOrFail($batchId);     
        
        // Calculate new quantity
        $newQty = $batch->current_quantity + $validated['quantity'];
        if ($newQty < 0) {
            return response()->json([
                'message' => 'Cannot reduce stock below 0. Current stock: ' . $batch->current_quantity
            ], 422);
        }   
        
        InventoryAdjustment::create([
            'stock_batch_id' => $batchId,
            'user_id'        => $validated['user_id'],
            'quantity'       => $validated['quantity'],
            'type'           => $validated['type'],
            'description'    => $validated['description'] ?? null,
            'date'           => $validated['date'],
        ]);
        
       $batch->update(['current_quantity' => $newQty]);    
       
        return response()->json([
            'message'          => 'Stock adjusted successfully',
            'current_quantity' => $newQty,
        ]);       
    }

    public function delete($id) {

        $batch = StockBatches::findOrFail($id);
        $batch->delete();
        return response()->json(['message' => 'Stock batch deleted']);        
    }

    public function openingStock(Request $request) {

        $validated = $request->validate([
            'product_id'     => 'required|exists:products,id',
            'quantity'       => 'required|integer|min:1',
            'purchase_price' => 'required|numeric|min:0',
            'batch_number'   => 'nullable|string',
            'expiry_date'    => 'nullable|date',
            'mfd'            => 'nullable|date',
            'user_id'        => 'required|exists:users,id',
        ]);

        $batch = StockBatches::create([
            'product_id'       => $validated['product_id'],
            'grn_id'           => null,
            'user_id'          => $validated['user_id'],
            'batch_number'     => $validated['batch_number'] ?? null,
            'mfd'              => $validated['mfd'] ?? null,
            'expiry_date'      => $validated['expiry_date'] ?? null,
            'purchase_price'   => $validated['purchase_price'],
            'initial_quantity' => $validated['quantity'],
            'current_quantity' => $validated['quantity'],
        ]);    
        
        $batch->load(['product.category', 'product.brand']);    

        return response()->json($batch, 201);
    }
}
