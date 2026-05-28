<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VatInvoice extends Model
{
    protected $table = 'vat_invoice';

    protected $fillable = [
        'invoice_id',
        'customer_id',
        'vat_invoice_number',
        'vat_invoice_date',
        'sub_total',
        'vat_percentage',
        'vat_amount',
        'total_amount',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customers::class);
    }
}
