<?php

namespace App\Http\Controllers;

use App\Models\Suppliers;
use App\Models\SupplierVatDetail;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function all()
    {
        $suppliers = Suppliers::with(['vatDetail'])->get();
        return response()->json($suppliers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'contact_no'          => 'required|string|max:20',
            'email'               => 'required|email',
            'address'             => 'required|string',
            'is_vat'              => 'sometimes|boolean',
            'vat_company_name'    => 'nullable|string|max:255',
            'vat_nick_name'       => 'nullable|string|max:255',
            'vat_company_address' => 'nullable|string',
            'vat_company_contact' => 'nullable|string|max:20',
            'vat_number'          => 'nullable|string|max:50',
        ]);

        $supplier = Suppliers::create([
            'name'       => $validated['name'],
            'contact_no' => $validated['contact_no'],
            'email'      => $validated['email'],
            'address'    => $validated['address'],
            'is_vat'     => $validated['is_vat'] ?? false,
        ]);

        if (!empty($validated['is_vat'])) {
            SupplierVatDetail::create([
                'supplier_id'     => $supplier->id,
                'company_name'    => $validated['vat_company_name']    ?? '',
                'nick_name'       => $validated['vat_nick_name']       ?? '',
                'company_address' => $validated['vat_company_address'] ?? '',
                'company_contact' => $validated['vat_company_contact'] ?? '',
                'vat_number'      => $validated['vat_number']          ?? '',
            ]);
        }

        $supplier->load(['vatDetail']);

        return response()->json($supplier, 201);
    }

    public function update(Request $request, $id)
    {
        $supplier = Suppliers::findOrFail($id);

        $validated = $request->validate([
            'name'                => 'required|string|max:255',
            'contact_no'          => 'required|string|max:20',
            'email'               => 'required|email',
            'address'             => 'required|string',
            'is_vat'              => 'sometimes|boolean',
            'vat_company_name'    => 'nullable|string|max:255',
            'vat_nick_name'       => 'nullable|string|max:255',
            'vat_company_address' => 'nullable|string',
            'vat_company_contact' => 'nullable|string|max:20',
            'vat_number'          => 'nullable|string|max:50',
        ]);

        $supplier->update([
            'name'       => $validated['name'],
            'contact_no' => $validated['contact_no'],
            'email'      => $validated['email'],
            'address'    => $validated['address'],
            'is_vat'     => $validated['is_vat'] ?? false,
        ]);

        if (!empty($validated['is_vat'])) {
            SupplierVatDetail::updateOrCreate(
                ['supplier_id' => $supplier->id],
                [
                    'company_name'    => $validated['vat_company_name']    ?? '',
                    'nick_name'       => $validated['vat_nick_name']       ?? '',
                    'company_address' => $validated['vat_company_address'] ?? '',
                    'company_contact' => $validated['vat_company_contact'] ?? '',
                    'vat_number'      => $validated['vat_number']          ?? '',
                ]
            );
        } else {
            // Remove VAT detail if unchecked
            SupplierVatDetail::where('supplier_id', $supplier->id)->delete();
        }

        $supplier->load(['company', 'vatDetail']);

        return response()->json($supplier);
    }

    public function delete($id)
    {
        $supplier = Suppliers::findOrFail($id);
        $supplier->delete();

        return response()->json(['message' => 'Supplier deleted']);
    }
}

