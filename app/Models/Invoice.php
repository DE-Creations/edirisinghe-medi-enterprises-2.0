<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_no',
        'sub_total',
        'discount',
        'grand_total',
        'paid_amount',
        'customer_id',
        'user_id',
        'status'
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItems::class, 'invoice_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customers::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
