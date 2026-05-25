<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function all() {
        $products = Product::with(['category', 'unitType', 'brand'])
            ->withSum('stockBatches', 'current_quantity')
            ->get();
        return response()->json($products);
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'generic_name'  => 'required|string|max:255',
            'sku'           => 'required|string|unique:products,sku',
            'barcode_value' => 'required|string|unique:products,barcode_value',
            'reorder_level' => 'required|integer',
            'category_id'   => 'required|exists:categories,id',
            'unit_type_id'  => 'required|exists:unit_types,id',
            'brand_id'      => 'required|exists:brands,id',
            'status'        => 'sometimes|integer',
        ]);

        $product = Product::create($validated);
        $product->load(['category', 'unitType', 'brand']);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id) {

        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'generic_name'  => 'required|string|max:255',
            'sku'           => 'required|string|unique:products,sku,' . $id, 
            'barcode_value' => 'required|string|unique:products,barcode_value,' . $id,
            'reorder_level' => 'required|integer',
            'category_id'   => 'required|exists:categories,id',
            'unit_type_id'  => 'required|exists:unit_types,id',
            'brand_id'      => 'required|exists:brands,id',
            'status'        => 'sometimes|integer',
        ]);

        $product->update($validated);
        $product->load(['category', 'unitType', 'brand']);
        $product->loadSum('stockBatches', 'current_quantity');
        return response()->json($product);
    }

    public function delete($id) {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
