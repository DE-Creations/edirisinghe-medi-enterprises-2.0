<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Receivable;

class Invoice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'po_number',
        'customer_id',
        'user_id',
        'invoice_date',
        'sub_total',
        'discount',
        'vat_percentage',
        'grand_total',
        'paid_amount',
        'payment_method',
        'status',
        'is_vat_invoice_issued',
    ];

    public function items(): HasMany {
        return $this->hasMany(InvoiceItems::class, 'invoice_id');
    }

    public function customer(): BelongsTo {
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function receivables(): HasMany {
        return $this->hasMany(Receivable::class, 'invoice_id');
    }

    public function paymentMethod(): BelongsTo {
        return $this->belongsTo(PaymentMethod::class, 'payment_method');
    }
}
