<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @page { margin: 15mm; size: 9.5in 11in portrait; }
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; line-height: 1.4; margin: 0; padding: 0 0 30px 0; }
        .company-header { font-size: 10pt; font-weight: bold; margin: 0; text-transform: uppercase; }
        .doc-title { font-size: 32pt; font-weight: bold; letter-spacing: 2px; margin: 10px 0 20px 0; text-transform: uppercase; }
        .header-meta { width: 100%; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 20px; }
        .header-meta td { font-size: 11pt; vertical-align: bottom; }
        .info-table { width: 100%; border-collapse: collapse; border-top: 1px solid #000; border-bottom: 1px solid #000; margin-bottom: 30px; }
        .info-table td { width: 50%; padding: 15px; vertical-align: top; }
        .info-table .right-col { border-left: 1px solid #000; }
        .info-title { font-size: 11pt; font-weight: bold; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
        .info-text { margin: 0 0 3px 0; }
        .items-tbl { width: 100%; border-collapse: collapse; margin-bottom: 30px; page-break-inside: auto; }
        .items-tbl thead { display: table-header-group; }
        .items-tbl tr { page-break-inside: avoid; page-break-after: auto; }
        .items-tbl th, .items-tbl td { padding: 10px; border-bottom: 1px solid #000; text-align: left; }
        .items-tbl th { font-weight: bold; text-transform: uppercase; font-size: 9pt; letter-spacing: 0.5px; border-top: 1px solid #000; }
        .items-tbl th.r, .items-tbl td.r { text-align: right; }
        .summary-table { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
        .summary-table td { vertical-align: top; }
        .notes-section { width: 60%; padding-right: 20px; }
        .totals-section { width: 40%; }
        .totals-tbl { width: 100%; border-collapse: collapse; }
        .totals-tbl td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        .totals-tbl td.lbl { font-weight: bold; text-transform: uppercase; font-size: 9pt; }
        .totals-tbl td.amt { text-align: right; }
        .grand-total { background-color: #f5f5f5; }
        .payment-history { width: 100%; margin-top: 30px; page-break-inside: auto; }
        .payment-history-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 8px; page-break-after: avoid; }
        .history-tbl { width: 100%; border-collapse: collapse; page-break-inside: auto; }
        .history-tbl thead { display: table-header-group; }
        .history-tbl tr { page-break-inside: avoid; page-break-after: auto; }
        .history-tbl th, .history-tbl td { padding: 7px 10px; border-bottom: 1px solid #ddd; font-size: 9pt; text-align: left; }
        .history-tbl th { font-weight: bold; text-transform: uppercase; font-size: 8.5pt; letter-spacing: 0.5px; border-top: 1px solid #000; border-bottom: 1px solid #000; }
        .history-tbl td.r, .history-tbl th.r { text-align: right; }
        .signing-section { position: fixed; bottom: 45px; width: 100%; }
        .footer { position: fixed; bottom: 0px; width: 100%; border-top: 1px solid #000; padding-top: 10px; font-size: 8pt; }
        .footer-table { width: 100%; }
        .footer-table td { vertical-align: middle; }
        .footer-left { text-align: left; }
        .footer-right { text-align: right; }
    </style>
</head>
<body>
    <p class="company-header">
        {{ $company->company_name ?? 'COMPANY NAME' }}<br>
        @if($company->company_address ?? false) <span style="font-weight: normal">{{ $company->company_address }}</span><br> @endif
        @if($company->company_phone ?? false) <span style="font-weight: normal">{{ $company->company_phone }}</span> @endif
    </p>

    <h1 class="doc-title">INVOICE</h1>

    <table class="header-meta">
        <tr>
            <td style="text-align: left;">{{ $invoice->invoice_number }}</td>
            @if($invoice->po_number)
                <td style="text-align: center;">PO No: {{ $invoice->po_number }}</td>
            @endif
            <td style="text-align: right;">Date: {{ $invoice->invoice_date ? \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') : '—' }}</td>
        </tr>
    </table>

    <table class="info-table">
        <tr>
            <td>
                <p class="info-title">CUSTOMER DETAILS </p>
                <p class="info-text"><strong>{{ $invoice->customer?->name ?? '—' }}</strong></p>
                @if($invoice->customer?->address) <p class="info-text">{{ $invoice->customer->address }}</p> @endif
                @if($invoice->customer?->contact_no) <p class="info-text">{{ $invoice->customer->contact_no }}</p> @endif
            </td>
            <td class="right-col">
                <p class="info-title">INVOICE DETAILS</p>
                @if($invoice->user?->name) <p class="info-text"><strong>Issued by:</strong> {{ $invoice->user->name }}</p> @endif
                @if($invoice->paymentMethod?->name) <p class="info-text"><strong>Payment:</strong> {{ ucfirst($invoice->paymentMethod->name) }}</p> @endif
                <p class="info-text"><strong>Status:</strong> {{ strtoupper($invoice->status ?? 'UNPAID') }}</p>
            </td>
        </tr>
    </table>

    <table class="items-tbl">
        <thead>
            <tr>
                <th style="width:5%;">NO</th>
                <th style="width:32%;">DESCRIPTION</th>
                <th style="width:20%;">BATCH</th>
                <th class="r" style="width:6%;">QTY</th>
                <th class="r" style="width:15%;">PRICE</th>
                <th class="r" style="width:22%;">AMOUNT</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $i => $item)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $item->stockBatch?->product?->generic_name ?? '—' }}</td>
                    <td>{{ $item->stockBatch?->batch_number ?? '—' }}</td>
                    <td class="r">{{ $item->quantity }}</td>
                    <td class="r">{{ number_format($item->unit_price, 2) }}</td>
                    <td class="r">{{ number_format($item->unit_price * $item->quantity, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @php
        $totalPaid      = $invoice->receivables->sum('amount');
        $invoiceBalance = ($invoice->grand_total ?? 0) - $totalPaid;
        $vatPct         = $invoice->vat_percentage ?? 0;
        $vatAmount      = ($invoice->grand_total ?? 0) - ($invoice->sub_total ?? 0) + ($invoice->discount ?? 0);
    @endphp
    <table class="summary-table">
        <tr>
            <td class="notes-section"></td>
            <td class="totals-section">
                <table class="totals-tbl">
                    <tr><td class="lbl">SUB TOTAL</td><td class="amt">{{ number_format($invoice->sub_total ?? 0, 2) }}</td></tr>
                    @if(($invoice->discount ?? 0) > 0)
                        <tr><td class="lbl">DISCOUNT</td><td class="amt">-{{ number_format($invoice->discount, 2) }}</td></tr>
                    @endif
                    @if($vatAmount > 0)
                        <tr><td class="lbl">VAT ({{ $vatPct }}%)</td><td class="amt">{{ number_format($vatAmount, 2) }}</td></tr>
                    @endif
                    <tr class="grand-total">
                        <td class="lbl" style="border-bottom: none;">TOTAL</td>
                        <td class="amt" style="border-bottom: none; font-weight: bold;">{{ number_format($invoice->grand_total ?? 0, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="lbl">PAID</td>
                        <td class="amt">{{ number_format($totalPaid, 2) }}</td>
                    </tr>
                    <tr>
                        <td class="lbl" style="border-bottom: none;">{{ $invoiceBalance > 0 ? 'BALANCE DUE' : 'CHANGE' }}</td>
                        <td class="amt" style="border-bottom: none; font-weight: bold; color: {{ $invoiceBalance > 0 ? '#c0392b' : '#27ae60' }}">
                            {{ number_format(abs($invoiceBalance), 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    @if($invoice->receivables->count() > 0)
    <div class="payment-history">
        <p class="payment-history-title">Payment History</p>
        <table class="history-tbl">
            <thead>
                <tr>
                    <th style="width:5%">#</th>
                    <th style="width:25%">Date</th>
                    <th class="r" style="width:25%">Amount</th>
                    <th style="width:45%">Note</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->receivables as $ri => $receipt)
                <tr>
                    <td>{{ $ri + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($receipt->dateTime)->format('d/m/Y') }}</td>
                    <td class="r">{{ number_format($receipt->amount, 2) }}</td>
                    <td>{{ $receipt->note ?? '—' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="signing-section">
        <table style="width: 80%; margin: 0 auto; border-collapse: collapse;">
            <tr>
                <td style="width: 30%; text-align: center; border-bottom: 1px dotted #000; height: 30px; vertical-align: bottom;">&nbsp;</td>
                <td style="width: 5%;">&nbsp;</td>
                <td style="width: 30%; text-align: center; border-bottom: 1px dotted #000; height: 30px; vertical-align: bottom;">&nbsp;</td>
                <td style="width: 5%;">&nbsp;</td>
                <td style="width: 30%; text-align: center; border-bottom: 1px dotted #000; height: 30px; vertical-align: bottom;">&nbsp;</td>
            </tr>
            <tr>
                <td style="text-align: center; font-size: 9pt; font-weight: bold; padding-top: 4px;">Prepared By</td>
                <td>&nbsp;</td>
                <td style="text-align: center; font-size: 9pt; font-weight: bold; padding-top: 4px;">Checked By</td>
                <td>&nbsp;</td>
                <td style="text-align: center; font-size: 9pt; font-weight: bold; padding-top: 4px;">Received By</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <table class="footer-table">
            <tr>
                <td class="footer-left">POWERED BY: DE CREATIONS®  |  decreations.lk  |  0703004483</td>
                <td class="footer-right">Generated: {{ \Carbon\Carbon::now()->format('d M Y') }}</td>
            </tr>
        </table>
    </div>
</body>
</html>