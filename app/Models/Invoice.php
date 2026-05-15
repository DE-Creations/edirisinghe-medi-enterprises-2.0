<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'customer_id',
        'user_id',
        'invoice_date',
        'sub_total',
        'discount',
        'grand_total',
        'paid_amount',
        'payment_method',
        'status',
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
}
