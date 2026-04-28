<?php

namespace App\Http\Controllers;

use App\Models\Suppliers;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function all() {

        $suppliers = Suppliers::with('company')->get();
        return response()->json($suppliers);
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'contact_no' => 'required|string|max:20',
            'email'      => 'required|email',
            'address'    => 'required|string',
            'company_id' => 'required|exists:companies,id',
        ]);

        $supplier = Suppliers::create($validated);

        $supplier->load('company');

        return response()->json($supplier, 201);
    }

    public function update(Request $request, $id) {

        $supplier = Suppliers::findOrFail($id); // 404 if not found

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'contact_no' => 'required|string|max:20',
            'email'      => 'required|email',
            'address'    => 'required|string',
            'company_id' => 'required|exists:companies,id',
        ]);

        $supplier->update($validated);

        $supplier->load('company');

        return response()->json($supplier);
    }

    public function delete($id) {

        $supplier = Suppliers::findOrFail($id);
        $supplier->delete(); // Soft delete

        return response()->json(['message' => 'Supplier deleted']);
    }
}
