<?php

namespace App\Http\Controllers;

use App\Models\Grn;
use App\Models\Grn_items;
use App\Models\StockBatches;
use App\Models\Product;
use App\Models\Suppliers;
use App\Models\Payable;
use App\Models\PaymentMethod;
use App\Models\Settings;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class GrnController extends Controller
{

    public function nextNumber()
    {

        $last = Grn::withTrashed()->latest()->first();
        $next = $last ? ($last->id + 1) : 1;
        return response()->json([
            'grn_number' => 'GRN-' . str_pad($next, 4, '0', STR_PAD_LEFT)
        ]);
    }

    // public function formData()
    // {
    //     try {
    //         $suppliers = Suppliers::all(['id', 'name']);
    //         $products = Product::with(['brand', 'category'])
    //             ->withSum('stockBatches', 'current_quantity')
    //             ->get();
    //         return response()->json([
    //             'suppliers' => $suppliers,
    //             'products' => $products
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'error' => $e->getMessage(),
    //             'line'  => $e->getLine(),
    //             'file'  => $e->getFile(),
    //         ], 500);
    //     }
    // }

    public function formData() {

        try {
            $suppliers  = \App\Models\Suppliers::all(['id', 'name', 'is_vat']);

            // Only load columns the GRN product-search panel actually uses
            $products   = Product::with(['brand:id,name'])
                ->select('id', 'generic_name', 'barcode_value', 'sku', 'brand_id')
                ->get();

            $categories     = \App\Models\Categories::all(['id', 'name']);
            $brands         = \App\Models\Brands::all(['id', 'name']);
            $unitTypes      = \App\Models\UnitTypes::all(['id', 'name']);
            $paymentMethods = PaymentMethod::orderBy('name')->get(['id', 'name']);

            // Include next GRN number so GRNPage needs only one request on load
            $last       = Grn::withTrashed()->latest()->first();
            $nextNum    = 'GRN-' . str_pad(($last ? $last->id + 1 : 1), 4, '0', STR_PAD_LEFT);

            return response()->json([
                'suppliers'       => $suppliers,
                'products'        => $products,
                'categories'      => $categories,
                'brands'          => $brands,
                'unit_types'      => $unitTypes,
                'payment_methods' => $paymentMethods,
                'next_number'     => $nextNum,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function all(Request $request)
    {
        $query = Grn::with([
                'supplier:id,name',
                'user:id,name',
                'items:id,grn_id,product_id,quantity,unit_price,batch_number,expiry_date',
                'items.product:id,generic_name',
            ])
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('grn_number', 'like', "%{$search}%")
                  ->orWhereHas('supplier', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('received_date', $request->date);
        }

        return response()->json($query->paginate(50));
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'supplier_id'            => 'required|exists:suppliers,id',
            'supplier_invoice_no'    => 'nullable|string',
            'received_date'          => 'required|date',
            'sub_total'              => 'required|numeric',
            'discount'               => 'required|numeric|min:0',
            'total_amount'           => 'required|numeric',
            'paid_amount'            => 'required|numeric|min:0',
            'payment_method_id'      => 'nullable|exists:payment_methods,id',
            'is_vat'                 => 'sometimes|boolean',
            'vat_amount'             => 'sometimes|numeric|min:0',
            'vat_percentage'         => 'sometimes|numeric|min:0',
            'notes'                  => 'nullable|string',
            'items'                  => 'required|array|min:1',
            'items.*.product_id'     => 'required|exists:products,id',
            'items.*.quantity'       => 'required|integer|min:1',
            'items.*.unit_price'     => 'required|numeric|min:0',
            'items.*.batch_number'   => 'nullable|string',
            'items.*.expiry_date'    => 'nullable|date',
            'items.*.mfd_date'       => 'nullable|date',
        ]);

        // Calculate payment status
        $status = 'unpaid';
        if ($validated['paid_amount'] >= $validated['total_amount']) {
            $status = 'paid';
        } elseif ($validated['paid_amount'] > 0) {
            $status = 'partial';
        }

        $grn = DB::transaction(function () use ($validated, $status) {

            $last   = Grn::withTrashed()->latest()->first();
            $next   = $last ? ($last->id + 1) : 1;
            $grnNum = 'GRN-' . str_pad($next, 4, '0', STR_PAD_LEFT);

            $userId = Auth::id();

            $grn = Grn::create([
                'grn_number'          => $grnNum,
                'supplier_id'         => $validated['supplier_id'],
                'user_id'             => $userId,
                'supplier_invoice_no' => $validated['supplier_invoice_no'] ?? null,
                'received_date'       => $validated['received_date'],
                'sub_total'           => $validated['sub_total'],
                'discount'            => $validated['discount'],
                'total_amount'        => $validated['total_amount'],
                'paid_amount'         => $validated['paid_amount'],
                'payment_method_id'   => $validated['payment_method_id'] ?? null,
                'is_vat'              => $validated['is_vat'] ?? false,
                'vat_amount'          => $validated['vat_amount'] ?? 0,
                'vat_percentage'      => $validated['vat_percentage'] ?? 0,
                'payment_status'      => $status,
                'notes'               => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {

                Grn_items::create([
                    'grn_id'        => $grn->id,
                    'product_id'    => $item['product_id'],
                    'quantity'      => $item['quantity'],
                    'unit_price'    => $item['unit_price'],
                    'batch_number'  => $item['batch_number'] ?? null,
                    'expiry_date'   => $item['expiry_date'] ?? null,
                    'mfd_date'      => $item['mfd_date'] ?? null,
                ]);

                StockBatches::create([
                    'product_id'       => $item['product_id'],
                    'grn_id'           => $grn->id,
                    'user_id'          => $userId,
                    'batch_number'     => $item['batch_number'] ?? null,
                    'mfd'              => $item['mfd_date'] ?? null,
                    'expiry_date'      => $item['expiry_date'] ?? null,
                    'purchase_price'   => $item['unit_price'],
                    'initial_quantity' => $item['quantity'],
                    'current_quantity' => $item['quantity'],
                ]);
            }

            // Record initial payment in payables table
            if ($validated['paid_amount'] > 0) {
                $note = $status === 'paid'
                    ? $grn->grn_number . ' Full Paid'
                    : $grn->grn_number . ' First Payment';

                Payable::create([
                    'grns_id'  => $grn->id,
                    'amount'   => $validated['paid_amount'],
                    'dateTime' => $validated['received_date'],
                    'note'     => $note,
                ]);
            }

            return $grn;
        });

        return response()->json(['message' => 'GRN saved successfully', 'id' => $grn->id], 201);
    }

    public function show($id)
    {
        $grn = Grn::with([
            'supplier:id,name,contact_no,address',
            'user:id,name',
            'items:id,grn_id,product_id,quantity,unit_price,batch_number,expiry_date',
            'items.product:id,generic_name',
            'payables',
        ])->findOrFail($id);

        // Map payables to the PaymentRecord shape the front-end expects
        $payments = $grn->payables->map(fn ($p) => [
            'id'     => $p->id,
            'amount' => $p->amount,
            'date'   => $p->dateTime,
            'notes'  => $p->note,
            'user'   => null,
        ]);

        return response()->json([
            'grn'      => $grn,
            'payments' => $payments,
        ]);
    }

    public function printView($id)
    {
        $grn = Grn::with([
            'supplier:id,name,contact_no,address',
            'user:id,name',
            'items:id,grn_id,product_id,quantity,unit_price,batch_number,expiry_date',
            'items.product:id,generic_name',
            'payables',
            'paymentMethod:id,name',
        ])->findOrFail($id);

        $company  = Settings::first();
        $logoPath = $this->resolveLogoPath();

        $pdf = Pdf::loadView('pdf.grn', [
            'grn'      => $grn,
            'company'  => $company,
            'logoPath' => $logoPath,
        ])->setPaper([0, 0, 684, 792], 'portrait');

        return $pdf->stream('GRN-' . $grn->grn_number . '.pdf');
    }

    private function resolveLogoPath(): ?string
    {
        $manifestPath = public_path('build/manifest.json');
        if (!file_exists($manifestPath)) {
            return null;
        }
        $manifest = json_decode(file_get_contents($manifestPath), true);
        $key      = 'resources/assets/logo.png';
        return isset($manifest[$key]) ? public_path('build/' . $manifest[$key]['file']) : null;
    }

    public function delete($id)
    {

        $grn = Grn::findOrFail($id);
        $grn->items()->delete();
        $grn->delete();
        return response()->json(['message' => 'GRN deleted']);
    }
}
