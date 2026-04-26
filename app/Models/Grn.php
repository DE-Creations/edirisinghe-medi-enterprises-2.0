<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grn extends Model
{
    protected $fillable = [
        'grn_number', 
        'total_amount', 
        'received_date', 
        'supplier_id', 
        'user_id', 
        'supplier_invoice_no'
    ];

    public function items(): HasMany { 
        return $this->hasMany(GrnItem::class , 'grn_id'); 
    }
    
    public function supplier(): BelongsTo { 
        return $this->belongsTo(Supplier::class); 
    }
}
