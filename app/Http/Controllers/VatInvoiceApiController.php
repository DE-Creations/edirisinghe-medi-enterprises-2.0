<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\VatInvoice;
use Illuminate\Support\Facades\DB;

class VatInvoiceApiController extends Controller
{
    public function getCustomers()
    {
        return DB::table('customers')
            ->where('is_vat', true)
            ->select('id', 'name', 'vat_nick_name')
            ->get();
    }

    public function getInvoices(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|integer',
            'year'        => 'required|integer',
            'month'       => 'required|integer',
        ]);

        return Invoice::where('customer_id', $request->customer_id)
            ->whereYear('invoice_date', $request->year)
            ->whereMonth('invoice_date', $request->month)
            ->select('id', 'invoice_number', 'invoice_date', 'grand_total', 'sub_total', 'is_vat_invoice_issued')
            ->orderBy('invoice_date')
            ->get();
    }

    public function getInvoiceData($id)
    {
        $invoice     = Invoice::with(['items.stockBatch.product', 'customer'])->findOrFail($id);
        $customerVat = DB::table('customers_vat_details')->where('customer_id', $invoice->customer_id)->first();

        $vatSetting = DB::table('vat_percentage')
            ->where('from_date', '<=', $invoice->invoice_date)
            ->orderBy('from_date', 'desc')
            ->first();
        $vatPercentage = $vatSetting ? $vatSetting->vat_percentage : 18;
        $vatAmount     = ($invoice->sub_total * $vatPercentage) / 100;

        return response()->json([
            'invoice'        => $invoice,
            'customer_vat'   => $customerVat,
            'vat_percentage' => $vatPercentage,
            'vat_amount'     => $vatAmount,
            'total_amount'   => $invoice->sub_total + $vatAmount,
        ]);
    }

    public function history(Request $request)
    {
        $query = VatInvoice::orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('vat_invoice_number', 'like', "%{$search}%");
        }

        $results = $query->get()->map(function ($vi) {
            $invoice  = Invoice::find($vi->invoice_id, ['invoice_number']);
            $customer = DB::table('customers')->where('id', $vi->customer_id)->first(['name']);
            return [
                'id'                  => $vi->id,
                'vat_invoice_number'  => $vi->vat_invoice_number,
                'vat_invoice_date'    => $vi->vat_invoice_date,
                'total_amount'        => $vi->total_amount,
                'created_at'          => $vi->created_at,
                'invoice'             => $invoice,
                'customer'            => $customer,
            ];
        });

        return response()->json(['data' => $results]);
    }
}
