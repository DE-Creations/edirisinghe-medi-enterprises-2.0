<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Settings;
use App\Models\Invoice;
use App\Models\VatInvoice;

class VatInvoiceController extends Controller
{
    public function generatePdf(Request $request)
    {
        $invoiceId = $request->input('invoice_id');
        $invoice   = Invoice::with(['customer', 'items.stockBatch.product', 'paymentMethod'])->findOrFail($invoiceId);

        if ($invoice->is_vat_invoice_issued) {
            abort(400, 'VAT Invoice already issued for this regular invoice.');
        }

        $customer    = $invoice->customer;
        $customerVat = DB::table('customers_vat_details')->where('customer_id', $customer->id)->first();
        $vatNickName = strtoupper($customerVat?->nick_name ?? substr($customer->name, 0, 2));
        $prefix      = date('y') . strtoupper(date('M')); // e.g. 26MAY

        // Global sequence across all VAT invoices
        $latestVat = VatInvoice::orderBy('id', 'desc')->first();
        $nextNum   = 1;
        if ($latestVat && preg_match('/_(\d+)$/', $latestVat->vat_invoice_number, $matches)) {
            $nextNum = intval($matches[1]) + 1;
        }

        $vatInvoiceNumber = sprintf('%s_%s_%05d', $prefix, $vatNickName, $nextNum);

        // Get VAT percentage from vat_percentage table (most recent applicable)
        $vatSetting    = DB::table('vat_percentage')
            ->where('from_date', '<=', $invoice->invoice_date)
            ->orderBy('from_date', 'desc')
            ->first();
        $vatPercentage = $vatSetting ? $vatSetting->vat_percentage : 18;

        $subTotal   = $invoice->sub_total;
        $vatAmount  = round(($subTotal * $vatPercentage) / 100, 2);
        $totalAmount = $subTotal + $vatAmount;

        // Create VAT Invoice record
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

        // Mark invoice as VAT issued
        $invoice->update(['is_vat_invoice_issued' => true]);

        return view('pdf.tax-invoice', $this->buildViewData(
            $invoice, $vatInvoice, $customer, $customerVat,
            $totalAmount, $vatPercentage, $vatAmount, $subTotal
        ));
    }

    public function viewHistoryPdf(Request $request)
    {
        $id         = $request->input('id');
        $vatInvoice = VatInvoice::with(['customer', 'invoice.items.stockBatch.product', 'invoice.paymentMethod'])->findOrFail($id);
        $invoice    = $vatInvoice->invoice;
        $customer   = $vatInvoice->customer;
        $customerVat = DB::table('customers_vat_details')->where('customer_id', $customer->id)->first();

        return view('pdf.tax-invoice', $this->buildViewData(
            $invoice,
            $vatInvoice,
            $customer,
            $customerVat,
            $vatInvoice->total_amount,
            $vatInvoice->vat_percentage,
            $vatInvoice->vat_amount,
            $vatInvoice->sub_total
        ));
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
            'companyVatNo'     => $company?->company_vat_no ?? '',
            'companyName'      => $company?->company_name ?? '',
            'companyAddress'   => $company?->company_address ?? '',
            'companyPhone'     => $company?->company_phone ?? '',
            'placeOfSupply'    => $company?->place_of_supply ?? '',
            'clientVatNo'      => $customerVat?->vat_number ?? '',
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
