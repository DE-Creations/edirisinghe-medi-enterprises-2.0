<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VatInvoiceController extends Controller
{
    public function generatePdf(Request $request)
    {
        $data = json_decode($request->input('data', '{}'), true);
        $data['totalInWords'] = $this->numberToWords((int) ($data['grandTotal'] ?? 0)) . ' Rupees Only';

        return view('pdf.tax-invoice', $data);
    }

    public function viewHistoryPdf(Request $request)
    {
        $data = json_decode($request->input('data', '{}'), true);
        $data['totalInWords'] = $this->numberToWords((int) ($data['grandTotal'] ?? 0)) . ' Rupees Only';

        return view('pdf.tax-invoice-history', $data);
    }

    private function numberToWords(int $number): string
    {
        if ($number === 0) {
            return 'Zero';
        }

        $ones = [
            '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
            'Seventeen', 'Eighteen', 'Nineteen',
        ];
        $tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if ($number < 20) {
            return $ones[$number];
        }
        if ($number < 100) {
            return $tens[(int) ($number / 10)] . ($number % 10 ? ' ' . $ones[$number % 10] : '');
        }
        if ($number < 1000) {
            return $ones[(int) ($number / 100)] . ' Hundred' . ($number % 100 ? ' ' . $this->numberToWords($number % 100) : '');
        }
        if ($number < 100000) {
            return $this->numberToWords((int) ($number / 1000)) . ' Thousand' . ($number % 1000 ? ' ' . $this->numberToWords($number % 1000) : '');
        }
        if ($number < 10000000) {
            return $this->numberToWords((int) ($number / 100000)) . ' Lakh' . ($number % 100000 ? ' ' . $this->numberToWords($number % 100000) : '');
        }

        return $this->numberToWords((int) ($number / 10000000)) . ' Crore' . ($number % 10000000 ? ' ' . $this->numberToWords($number % 10000000) : '');
    }
}
