<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Settings;
use App\Models\Invoice;
use App\Models\VatInvoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class VatInvoiceController extends Controller
{
    public function generatePdf(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required|integer',
            'from_date'  => 'nullable|date',
        ]);

        try {
            $invoiceId = $request->input('invoice_id');
            $fromDate  = $request->input('from_date');
            $invoice   = Invoice::with(['customer', 'items.stockBatch.product', 'paymentMethod'])->findOrFail($invoiceId);

            if ($invoice->is_vat_invoice_issued) {
                return response()->json(['message' => 'VAT Invoice already issued for this regular invoice.'], 400);
            }

            $customer    = $invoice->customer;
            $customerVat = DB::table('customers_vat_details')->where('customer_id', $customer->id)->first();

            return DB::transaction(function () use ($invoice, $customer, $customerVat, $fromDate) {
                // Lock the last-generated VAT invoice row so concurrent requests
                // serialize on number generation instead of racing each other.
                DB::table('vat_invoice')->lockForUpdate()->orderBy('id', 'desc')->first();

                $vatInvoiceNumber = $this->generateNextVatInvoiceNumber(
                    $invoice->invoice_date,
                    $fromDate,
                    $customerVat?->nick_name
                );

                if (VatInvoice::where('vat_invoice_number', $vatInvoiceNumber)->exists()) {
                    return response()->json([
                        'message' => 'Generated VAT invoice number already exists, please try again.',
                    ], 409);
                }

                $vatSetting    = DB::table('vat_percentage')
                    ->where('from_date', '<=', $invoice->invoice_date)
                    ->orderBy('from_date', 'desc')
                    ->first();
                $vatPercentage = $vatSetting ? $vatSetting->vat_percentage : 18;

                $subTotal    = $invoice->sub_total;
                $vatAmount   = ($subTotal * $vatPercentage) / 100;
                $totalAmount = $subTotal + $vatAmount;

                $vatInvoice = VatInvoice::create([
                    'invoice_id'         => $invoice->id,
                    'customer_id'        => $customer->id,
                    'vat_invoice_number' => $vatInvoiceNumber,
                    'vat_invoice_date'   => now()->toDateString(),
                    'sub_total'          => $subTotal,
                    'vat_percentage'     => $vatPercentage,
                    'vat_amount'         => $vatAmount,
                    'total_amount'       => $totalAmount,
                ]);

                $invoice->update(['is_vat_invoice_issued' => true]);

                return Pdf::loadView('pdf.tax-invoice', $this->buildViewData(
                    $invoice, $vatInvoice, $customer, $customerVat,
                    $totalAmount, $vatPercentage, $vatAmount, $subTotal
                ))->setPaper([0, 0, 684, 792], 'portrait')->stream('TaxInvoice-' . $vatInvoiceNumber . '.pdf');
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Build the next tax invoice number: {YY}{MON}_{NICK}_{SEQ}, e.g. 26JUL_TAX_00014.
     *
     * - YY   comes from $fromDate when given, otherwise $invoiceDate.
     * - MON  always comes from $invoiceDate (the underlying invoice's own date).
     * - NICK is the customer's VAT nickname, or the literal "TAX" when unset/blank.
     * - SEQ  is a single global counter (not per-customer): it continues from the
     *        very last VAT invoice number ever generated, resetting to 1 whenever
     *        the 2-digit year prefix changes.
     */
    private function generateNextVatInvoiceNumber(string $invoiceDate, ?string $fromDate, ?string $nickName): string
    {
        $yy  = Carbon::parse($fromDate ?: $invoiceDate)->format('y');
        $mon = strtoupper(Carbon::parse($invoiceDate)->format('M'));
        $prefix = $yy . $mon;

        $nick = ($nickName !== null && trim($nickName) !== '')
            ? strtoupper(trim($nickName))
            : 'TAX';

        $lastVatInvoice = VatInvoice::orderBy('id', 'desc')->first();

        $sequence = 1;
        if ($lastVatInvoice) {
            $lastNumber     = $lastVatInvoice->vat_invoice_number;
            $lastYearPrefix = substr($lastNumber, 0, 2);
            $lastSequence   = (int) substr($lastNumber, -5);
            $sequence = ($lastYearPrefix === $yy) ? $lastSequence + 1 : 1;
        }

        // Skip forward past any number that already exists for this exact
        // slot (e.g. leftover data from the previous per-customer numbering
        // scheme) so a single generation call is self-healing rather than
        // deterministically re-colliding forever on retry.
        do {
            $vatInvoiceNumber = sprintf('%s_%s_%05d', $prefix, $nick, $sequence);
            $taken = VatInvoice::where('vat_invoice_number', $vatInvoiceNumber)->exists();
            $sequence++;
        } while ($taken);

        return $vatInvoiceNumber;
    }

    public function viewHistoryPdf(Request $request)
    {
        try {
            $id         = $request->input('id');
            $vatInvoice = VatInvoice::with(['customer', 'invoice.items.stockBatch.product', 'invoice.paymentMethod'])->findOrFail($id);
            $invoice    = $vatInvoice->invoice;
            $customer   = $vatInvoice->customer;
            $customerVat = DB::table('customers_vat_details')->where('customer_id', $customer->id)->first();

            return Pdf::loadView('pdf.tax-invoice-history', $this->buildViewData(
                $invoice,
                $vatInvoice,
                $customer,
                $customerVat,
                $vatInvoice->total_amount,
                $vatInvoice->vat_percentage,
                $vatInvoice->vat_amount,
                $vatInvoice->sub_total
            ))->setPaper([0, 0, 684, 792], 'portrait')->stream('TaxInvoice-' . $vatInvoice->vat_invoice_number . '.pdf');
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    private function buildViewData($invoice, $vatInvoice, $customer, $customerVat, $totalAmount, $vatPercentage, $vatAmount, $subTotal): array
    {
        $company = Settings::first();

        $records = $invoice->items->map(function ($item) use ($invoice) {
            $product       = $item->stockBatch?->product;
            $amountExclVat = $item->quantity * $item->unit_price;
            return [
                'refNo'         => $invoice->invoice_number,
                'invoiceItem'   => $product?->generic_name ?? 'N/A',
                'quantity'      => $item->quantity,
                'unitPrice'     => $item->unit_price,
                'amountExclVat' => $amountExclVat,
            ];
        })->toArray();

        return [
            'taxInvoiceNumber' => $vatInvoice->vat_invoice_number,
            'printedDateTime'  => $vatInvoice->vat_invoice_date,
            'companyVatNo'     => substr($company?->company_vat_no ?? '', 0, 9),
            'companyName'      => $company?->company_name ?? '',
            'companyAddress'   => $company?->company_address ?? '',
            'companyPhone'     => $company?->company_phone ?? '',
            'placeOfSupply'    => $company?->place_of_supply ?? '',
            'clientVatNo'      => substr($customerVat?->vat_number ?? '', 0, 9),
            'clientName'       => $customerVat?->company_name ?? $customer->name,
            'clientAddress'    => $customerVat?->company_address ?? $customer->address ?? '',
            'clientPhone'      => $customerVat?->company_contact ?? $customer->contact_no ?? '',
            'records'          => $records,
            'subtotal'         => $subTotal,
            'vatPercentage'    => $vatPercentage,
            'vatAmount'        => $vatAmount,
            'grandTotal'       => $totalAmount,
            'totalInWords'     => $this->convertNumberToWords((int) $totalAmount) . ' Rupees Only',
            'paymentMode'      => $invoice->paymentMethod?->name ?? 'N/A',
        ];
    }

    public function convertNumberToWords($number)
    {
        $ones  = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
                  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        $tens  = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        $teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        if ($number == 0) {
            return 'Zero';
        }

        $words = '';

        if ($number >= 1000000000) {
            $words .= $this->convertNumberToWords(floor($number / 1000000000)) . ' Billion ';
            $number %= 1000000000;
        }
        if ($number >= 1000000) {
            $words .= $this->convertNumberToWords(floor($number / 1000000)) . ' Million ';
            $number %= 1000000;
        }
        if ($number >= 1000) {
            $words .= $this->convertNumberToWords(floor($number / 1000)) . ' Thousand ';
            $number %= 1000;
        }
        if ($number >= 100) {
            $words .= $ones[floor($number / 100)] . ' Hundred ';
            $number %= 100;
        }
        if ($number >= 20) {
            $tensDigit = floor($number / 10);
            $onesDigit = $number % 10;
            $words .= $tens[$tensDigit];
            if ($onesDigit > 0) {
                $words .= ' ' . $ones[$onesDigit];
            }
        } elseif ($number >= 10) {
            $words .= $teens[$number - 10];
        } elseif ($number > 0) {
            $words .= $ones[$number];
        }

        return trim($words);
    }
}
