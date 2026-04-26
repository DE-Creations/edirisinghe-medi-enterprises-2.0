<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customers;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'contact_no' => 'nullable|string|max:20',
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
}
