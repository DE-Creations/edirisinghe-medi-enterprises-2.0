<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Customers;

class CustomerController extends Controller
{
    /**
     * Return all customers with their VAT detail fields merged (LEFT JOIN).
     */
    public function all()
    {
        return response()->json(
            DB::table('customers')
                ->leftJoin('customers_vat_details', 'customers.id', '=', 'customers_vat_details.customer_id')
                ->select(
                    'customers.id',
                    'customers.name',
                    'customers.contact_no',
                    'customers.address',
                    'customers.is_vat',
                    'customers.balance_amount',
                    'customers_vat_details.company_name',
                    'customers_vat_details.nick_name',
                    'customers_vat_details.company_address',
                    'customers_vat_details.company_contact',
                    'customers_vat_details.vat_number'
                )
                ->orderBy('customers.name')
                ->get()
        );
    }

    /**
     * Create a new customer.
     * Core fields go to `customers`; VAT details go to `customers_vat_details`.
     */
    public function store(Request $request)
    {
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

        $customer = Customers::create([
            'name'       => $validated['name'],
            'contact_no' => $validated['contact_no'],
            'address'    => $validated['address'] ?? null,
            'is_vat'     => $validated['is_vat'],
        ]);

        if ($validated['is_vat']) {
            DB::table('customers_vat_details')->insert([
                'customer_id'     => $customer->id,
                'company_name'    => $validated['company_name']    ?? null,
                'nick_name'       => $validated['nick_name']       ?? null,
                'company_address' => $validated['company_address'] ?? null,
                'company_contact' => $validated['company_contact'] ?? null,
                'vat_number'      => $validated['vat_number']      ?? null,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }

        return response()->json($this->findWithVat($customer->id), 201);
    }

    /**
     * Update an existing customer.
     */
    public function update(Request $request, $id)
    {
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

        $customer->update([
            'name'       => $validated['name'],
            'contact_no' => $validated['contact_no'],
            'address'    => $validated['address'] ?? null,
            'is_vat'     => $validated['is_vat'],
        ]);

        if ($validated['is_vat']) {
            DB::table('customers_vat_details')->updateOrInsert(
                ['customer_id' => $id],
                [
                    'company_name'    => $validated['company_name']    ?? null,
                    'nick_name'       => $validated['nick_name']       ?? null,
                    'company_address' => $validated['company_address'] ?? null,
                    'company_contact' => $validated['company_contact'] ?? null,
                    'vat_number'      => $validated['vat_number']      ?? null,
                    'updated_at'      => now(),
                ]
            );
        } else {
            // Customer is no longer VAT — remove any existing VAT detail record
            DB::table('customers_vat_details')->where('customer_id', $id)->delete();
        }

        return response()->json($this->findWithVat($id));
    }

    /**
     * Delete a customer (cascade deletes the VAT details row via FK).
     */
    public function delete($id)
    {
        Customers::findOrFail($id)->delete();
        return response()->json(['message' => 'Customer deleted']);
    }

    /**
     * Helper: fetch a single customer row with VAT details merged.
     */
    private function findWithVat($id)
    {
        return DB::table('customers')
            ->leftJoin('customers_vat_details', 'customers.id', '=', 'customers_vat_details.customer_id')
            ->select(
                'customers.id',
                'customers.name',
                'customers.contact_no',
                'customers.address',
                'customers.is_vat',
                'customers.balance_amount',
                'customers_vat_details.company_name',
                'customers_vat_details.nick_name',
                'customers_vat_details.company_address',
                'customers_vat_details.company_contact',
                'customers_vat_details.vat_number'
            )
            ->where('customers.id', $id)
            ->first();
    }
}

