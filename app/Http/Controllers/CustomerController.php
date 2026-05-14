<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customers;

class CustomerController extends Controller
{
    public function all() {
        return response()->json(Customers::all());
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'contact_no'      => 'required|string',
            'address'         => 'nullable|string',
            'is_vat'          => 'required|boolean',

            // Only required if is_vat = true
            'company_name'    => 'nullable|required_if:is_vat,true|string',
            'nick_name'       => 'nullable|string',
            'company_address' => 'nullable|required_if:is_vat,true|string',
            'company_contact' => 'nullable|string',
            'vat_number'      => 'nullable|required_if:is_vat,true|string',
        ]);

        $customer = Customers::create($validated);
        return response()->json($customer, 201);
    }

    public function update(Request $request, $id) {

        $customer = Customers::findOrFail($id);

        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'contact_no'      => 'required|string',
            'address'         => 'nullable|string',
            'is_vat'          => 'required|boolean',
            'company_name'    => 'nullable|required_if:is_vat,true|string',
            'nick_name'       => 'nullable|string',
            'company_address' => 'nullable|required_if:is_vat,true|string',
            'company_contact' => 'nullable|string',
            'vat_number'      => 'nullable|required_if:is_vat,true|string',
        ]);

        $customer->update($validated);
        return response()->json($customer);
    }

    public function delete($id) {

        Customer::findOrFail($id)->delete();
        return response()->json(['message' => 'Customer deleted']);
    }
}
