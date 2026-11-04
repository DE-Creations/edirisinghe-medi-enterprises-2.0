<?php

namespace App\Http\Controllers;

use App\Models\CreditNote;
use App\Models\CreditNoteItems;
use App\Models\Invoice;
use App\Models\InvoiceItems;
use App\Models\InventoryAdjustment;
use App\Models\Settings;
use App\Models\StockBatches;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreditNoteController extends Controller
{
    public function nextNumber()
    {
        $last = CreditNote::withTrashed()->latest()->first();
        $next = $last ? ($last->id + 1) : 1;
        return response()->json([
            'credit_note_number' => 'CN-' . str_pad($next, 4, '0', STR_PAD_LEFT)
        ]);
    }

    /**
     * Lightweight invoice lookup for the credit-note picker (by invoice number or customer name).
     */
    public function searchInvoices(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $query = Invoice::with(['customer:id,name'])
            ->select('id', 'invoice_number', 'invoice_date', 'customer_id', 'grand_total');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        $invoices = $query->latest()->limit(20)->get();

        return response()->json($invoices);
    }

    /**
     * Full invoice detail for building a credit note, including how much of
     * each line item has already been credited so the UI can cap quantities.
     */
    public function getInvoiceForCredit($id)
    {
        $invoice = Invoice::with([
            'customer:id,name,contact_no,address',
            'items:id,invoice_id,stock_batch_id,quantity,unit_price',
            'items.stockBatch:id,batch_number,product_id',
            'items.stockBatch.product:id,generic_name',
        ])->findOrFail($id);

        $itemIds = $invoice->items->pluck('id');
        $creditedQty = CreditNoteItems::whereIn('invoice_item_id', $itemIds)
            ->selectRaw('invoice_item_id, SUM(quantity) as credited')
            ->groupBy('invoice_item_id')
            ->pluck('credited', 'invoice_item_id');

        $items = $invoice->items->map(function ($item) use ($creditedQty) {
            $credited = (int) ($creditedQty[$item->id] ?? 0);
            return [
                'id'              => $item->id,
                'stock_batch_id'  => $item->stock_batch_id,
                'batch_number'    => $item->stockBatch?->batch_number,
                'product_name'    => $item->stockBatch?->product?->generic_name ?? 'N/A',
                'quantity'        => $item->quantity,
                'unit_price'      => $item->unit_price,
                'credited_qty'    => $credited,
                'remaining_qty'   => max(0, $item->quantity - $credited),
            ];
        });

        return response()->json([
            'id'             => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'invoice_date'   => $invoice->invoice_date,
            'customer'       => $invoice->customer,
            'items'          => $items,
        ]);
    }

    public function all(Request $request)
    {
        $query = CreditNote::with([
                'customer:id,name,contact_no,address',
                'invoice:id,invoice_number',
                'user:id,name',
                'items',
            ])
            ->latest()
            ->orderByDesc('id'); // tie-breaker so pages never overlap or skip rows

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('credit_note_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('invoice', fn ($q) => $q->where('invoice_number', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('credit_note_date', $request->date);
        }

        // Default view: last 3 months only. A search or an explicit date looks further back.
        if (!$request->filled('search') && !$request->filled('date')) {
            $query->where('credit_note_date', '>=', now()->subMonths(3)->startOfDay());
        }

        return response()->json($query->paginate(20));
    }

    public function show($id)
    {
        $creditNote = CreditNote::with([
            'customer:id,name,contact_no,address',
            'invoice:id,invoice_number,invoice_date',
            'user:id,name',
            'items.stockBatch:id,batch_number,product_id',
            'items.stockBatch.product:id,generic_name',
        ])->findOrFail($id);

        return response()->json(['credit_note' => $creditNote]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id'                => 'required|exists:invoices,id',
            'credit_note_date'          => 'required|date',
            'notes'                     => 'nullable|string',
            'items'                     => 'required|array|min:1',
            'items.*.invoice_item_id'   => 'required|integer|exists:invoice_items,id',
            'items.*.quantity'          => 'required|integer|min:1',
            'items.*.reason'            => 'required|in:shortage,damage',
            'items.*.stock_action'      => 'nullable|in:restock,reduce',
        ]);

        try {
            $creditNote = DB::transaction(function () use ($validated) {
                $invoice = Invoice::findOrFail($validated['invoice_id']);
                $userId  = Auth::id();

                $last   = CreditNote::withTrashed()->latest()->first();
                $next   = $last ? ($last->id + 1) : 1;
                $cnNum  = 'CN-' . str_pad($next, 4, '0', STR_PAD_LEFT);

                $subTotal = 0;
                $rows = [];

                foreach ($validated['items'] as $row) {
                    $invoiceItem = InvoiceItems::findOrFail($row['invoice_item_id']);

                    if ($invoiceItem->invoice_id !== $invoice->id) {
                        throw ValidationException::withMessages([
                            'items' => "Line item does not belong to the selected invoice.",
                        ]);
                    }

                    $alreadyCredited = CreditNoteItems::where('invoice_item_id', $invoiceItem->id)->sum('quantity');
                    $remaining = $invoiceItem->quantity - $alreadyCredited;

                    if ($row['quantity'] > $remaining) {
                        throw ValidationException::withMessages([
                            'items' => "Requested quantity exceeds the remaining creditable quantity ({$remaining}) for this item.",
                        ]);
                    }

                    // Shortage is always a restock; damage lets the user choose.
                    $stockAction = $row['reason'] === 'shortage' ? 'restock' : ($row['stock_action'] ?? null);
                    if ($row['reason'] === 'damage' && !$stockAction) {
                        throw ValidationException::withMessages([
                            'items' => 'Please choose whether damaged stock should be restocked or reduced.',
                        ]);
                    }

                    $amount = $row['quantity'] * $invoiceItem->unit_price;
                    $subTotal += $amount;

                    $rows[] = [
                        'invoice_item'  => $invoiceItem,
                        'quantity'      => $row['quantity'],
                        'reason'        => $row['reason'],
                        'stock_action'  => $stockAction,
                    ];
                }

                $creditNote = CreditNote::create([
                    'credit_note_number' => $cnNum,
                    'invoice_id'          => $invoice->id,
                    'customer_id'         => $invoice->customer_id,
                    'user_id'             => $userId,
                    'credit_note_date'    => $validated['credit_note_date'],
                    'sub_total'           => $subTotal,
                    'notes'               => $validated['notes'] ?? null,
                ]);

                foreach ($rows as $row) {
                    $invoiceItem = $row['invoice_item'];

                    CreditNoteItems::create([
                        'credit_note_id'  => $creditNote->id,
                        'invoice_item_id' => $invoiceItem->id,
                        'stock_batch_id'  => $invoiceItem->stock_batch_id,
                        'quantity'        => $row['quantity'],
                        'unit_price'      => $invoiceItem->unit_price,
                        'reason'          => $row['reason'],
                        'stock_action'    => $row['stock_action'],
                    ]);

                    if ($row['stock_action'] === 'restock') {
                        $batch = StockBatches::findOrFail($invoiceItem->stock_batch_id);
                        $batch->update(['current_quantity' => $batch->current_quantity + $row['quantity']]);

                        InventoryAdjustment::create([
                            'stock_batch_id'  => $batch->id,
                            'credit_note_id'  => $creditNote->id,
                            'user_id'         => $userId,
                            'quantity'        => $row['quantity'],
                            'type'            => 'credit_note',
                            'description'     => "Credit Note {$cnNum} — " . ucfirst($row['reason']) . ' restock (Invoice ' . $invoice->invoice_number . ')',
                            'date'            => $validated['credit_note_date'],
                        ]);
                    }
                    // reason=damage & stock_action=reduce: the quantity was already
                    // deducted from stock at the time of the original sale, so no
                    // further stock movement is made — this credit note row itself
                    // is the audit record of the write-off decision.
                }

                return $creditNote;
            });

            return response()->json([
                'message' => 'Credit note saved successfully',
                'id'      => $creditNote->id,
                'credit_note_number' => $creditNote->credit_note_number,
            ], 201);
        } catch (ValidationException $e) {
            return response()->json(['message' => collect($e->errors())->flatten()->first()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function printView($id)
    {
        $creditNote = CreditNote::with([
            'customer:id,name,contact_no,address',
            'invoice:id,invoice_number,invoice_date',
            'user:id,name',
            'items.stockBatch:id,batch_number,product_id',
            'items.stockBatch.product:id,generic_name',
        ])->findOrFail($id);

        $company  = Settings::first();
        $logoPath = $this->resolveLogoPath();

        $pdf = Pdf::loadView('pdf.credit-note', [
            'creditNote' => $creditNote,
            'company'    => $company,
            'logoPath'   => $logoPath,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('CreditNote-' . $creditNote->credit_note_number . '.pdf');
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
        $creditNote = CreditNote::findOrFail($id);
        $creditNote->items()->delete();
        $creditNote->delete();
        return response()->json(['message' => 'Credit note deleted']);
    }
}
