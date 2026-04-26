<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customers;

class CustomerController extends Controller
{
    public function all()
    {
        $all_customers = Customers::get();
        return response()->json($all_customers);
        // dd(response()->json($all_customers));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'mobile' => 'nullable|string|max:20',
            'isVat' => 'nullable'
        ]);

        $data = [
            'name' => $request['name'],
            'contact_no' => $request['mobile'],
            'address' => $request['address'],
        ];

        $created_customer = Customers::create($data);
        $created_customer->save();

        return response()->json($created_customer, 201);

        //if ($request->has('isVat')) {
        //     $customer = \App\Models\Customer::find($request->id);
        //     if (!$customer) {
        //         return response()->json(['message' => 'Customer not found'], 404);
        //     }
        //     $customer->update($validated);
        // } else {

        // return response()->json($customer, 201);
        // }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'mobile' => 'nullable|string|max:20',
            'isVat' => 'nullable'
        ]);

        $customer = Customers::findOrFail($id);

        $customer->update([
            'name' => $validated['name'],
            'contact_no' => $validated['mobile'], // or fix naming
            'address' => $validated['address'],
        ]);

        return response()->json($customer, 200);
    }

    public function delete($id)
    {
        $customer = Customers::findOrFail($id);
        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully'
        ], 200);
    }
}
