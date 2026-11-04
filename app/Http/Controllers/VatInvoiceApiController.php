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
            ->leftJoin('customers_vat_details', 'customers.id', '=', 'customers_vat_details.customer_id')
            ->where('customers.is_vat', true)
            ->select('customers.id', 'customers.name', 'customers_vat_details.nick_name as vat_nick_name')
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
        $query = VatInvoice::with(['invoice:id,invoice_number', 'customer:id,name'])
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc'); // tie-breaker so pages never overlap or skip rows

        if (! $request->filled('search')) {
            // Default view: last 3 months only. Searching looks through everything.
            $query->where('created_at', '>=', now()->subMonths(3)->startOfDay());
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('vat_invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($c) use ($search) {
                      $c->where('name', 'like', "%{$search}%")
                        ->orWhereHas('vatDetail', function ($v) use ($search) {
                            $v->where('company_name', 'like', "%{$search}%")
                              ->orWhere('nick_name', 'like', "%{$search}%");
                        });
                  })
                  ->orWhereHas('invoice', function ($i) use ($search) {
                      $i->where('invoice_number', 'like', "%{$search}%");
                  });
            });
        }

        $results = $query->paginate(20)->through(function ($vi) {
            return [
                'id'                  => $vi->id,
                'vat_invoice_number'  => $vi->vat_invoice_number,
                'vat_invoice_date'    => $vi->vat_invoice_date,
                'total_amount'        => $vi->total_amount,
                'created_at'          => $vi->created_at,
                'invoice'             => $vi->invoice,
                'customer'            => $vi->customer,
            ];
        });

        return response()->json($results);
    }
}
