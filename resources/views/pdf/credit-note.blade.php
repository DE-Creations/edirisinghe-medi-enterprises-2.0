<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Credit Note {{ $creditNote->credit_note_number }}</title>
    <style>
        @page { margin: 15mm; size: A4 portrait; }
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; line-height: 1.4; margin: 0; padding: 0 0 30px 0; }
        .company-header { font-size: 10pt; font-weight: bold; margin: 0; text-transform: uppercase; }
        .doc-title { font-size: 30pt; font-weight: bold; letter-spacing: 2px; margin: 10px 0 20px 0; text-transform: uppercase; color: #7a1f1f; }
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
        .items-tbl th, .items-tbl td { padding: 9px 8px; border-bottom: 1px solid #000; text-align: left; }
        .items-tbl th { font-weight: bold; text-transform: uppercase; font-size: 8.5pt; letter-spacing: 0.5px; border-top: 1px solid #000; }
        .items-tbl th.r, .items-tbl td.r { text-align: right; }
        .items-tbl th.c, .items-tbl td.c { text-align: center; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 8pt; font-weight: bold; text-transform: uppercase; }
        .tag-shortage { background-color: #fff3cd; color: #8a6d00; }
        .tag-damage { background-color: #fde2e2; color: #9c2b2b; }
        .summary-table { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
        .summary-table td { vertical-align: top; }
        .notes-section { width: 60%; padding-right: 20px; }
        .notes-title { font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 5px 0; }
        .totals-section { width: 40%; }
        .totals-tbl { width: 100%; border-collapse: collapse; }
        .totals-tbl td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
        .totals-tbl td.lbl { font-weight: bold; text-transform: uppercase; font-size: 9pt; }
        .totals-tbl td.amt { text-align: right; }
        .grand-total { background-color: #f5f5f5; }
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

    <h1 class="doc-title">Credit Note</h1>

    <table class="header-meta">
        <tr>
            <td style="text-align: left;">{{ $creditNote->credit_note_number }}</td>
            <td style="text-align: center;">Ref. Invoice: {{ $creditNote->invoice?->invoice_number ?? '—' }}</td>
            <td style="text-align: right;">Date: {{ $creditNote->credit_note_date ? \Carbon\Carbon::parse($creditNote->credit_note_date)->format('d/m/Y') : '—' }}</td>
        </tr>
    </table>

    <table class="info-table">
        <tr>
            <td>
                <p class="info-title">CUSTOMER DETAILS</p>
                <p class="info-text"><strong>{{ $creditNote->customer?->name ?? 'Walk-in Customer' }}</strong></p>
                @if($creditNote->customer?->address) <p class="info-text">{{ $creditNote->customer->address }}</p> @endif
                @if($creditNote->customer?->contact_no) <p class="info-text">{{ $creditNote->customer->contact_no }}</p> @endif
            </td>
            <td class="right-col">
                <p class="info-title">CREDIT NOTE DETAILS</p>
                @if($creditNote->user?->name) <p class="info-text"><strong>Issued by:</strong> {{ $creditNote->user->name }}</p> @endif
                <p class="info-text"><strong>Original Invoice Date:</strong> {{ $creditNote->invoice?->invoice_date ? \Carbon\Carbon::parse($creditNote->invoice->invoice_date)->format('d/m/Y') : '—' }}</p>
            </td>
        </tr>
    </table>

    <table class="items-tbl">
        <thead>
            <tr>
                <th style="width:4%;">NO</th>
                <th style="width:26%;">DESCRIPTION</th>
                <th style="width:14%;">BATCH</th>
                <th class="r" style="width:6%;">QTY</th>
                <th class="r" style="width:13%;">PRICE</th>
                <th class="r" style="width:15%;">AMOUNT</th>
                <th class="c" style="width:11%;">REASON</th>
                <th style="width:11%;">STOCK ACTION</th>
            </tr>
        </thead>
        <tbody>
            @foreach($creditNote->items as $i => $item)
                <tr>
                    <td>{{ $i + 1 }}</td>
                    <td>{{ $item->stockBatch?->product?->generic_name ?? '—' }}</td>
                    <td>{{ $item->stockBatch?->batch_number ?? '—' }}</td>
                    <td class="r">{{ $item->quantity }}</td>
                    <td class="r">{{ number_format($item->unit_price, 2) }}</td>
                    <td class="r">{{ number_format($item->unit_price * $item->quantity, 2) }}</td>
                    <td class="c">
                        <span class="tag {{ $item->reason === 'damage' ? 'tag-damage' : 'tag-shortage' }}">{{ $item->reason }}</span>
                    </td>
                    <td>{{ $item->stock_action === 'restock' ? 'Restocked' : 'Written off' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="summary-table">
        <tr>
            <td class="notes-section">
                @if($creditNote->notes)
                    <p class="notes-title">Notes</p>
                    <p class="info-text">{{ $creditNote->notes }}</p>
                @endif
            </td>
            <td class="totals-section">
                <table class="totals-tbl">
                    <tr class="grand-total">
                        <td class="lbl" style="border-bottom: none;">CREDIT TOTAL</td>
                        <td class="amt" style="border-bottom: none; font-weight: bold;">{{ number_format($creditNote->sub_total ?? 0, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

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
                <td style="text-align: center; font-size: 9pt; font-weight: bold; padding-top: 4px;">Approved By</td>
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
