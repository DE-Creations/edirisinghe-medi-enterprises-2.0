<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function items(): HasMany {
        return $this->hasMany(InvoiceItem::class , 'invoice_id');
    }

    public function customer(): BelongsTo {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
