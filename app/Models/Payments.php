<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payments extends Model
{
    protected $fillable = [
        'invoice_id', 
        'type', 
        'amount', 
        'transaction_date', 
        'cheque_number'
    ];

    public function invoice(): BelongsTo {
            return $this->belongsTo(Invoice::class);
    }
}
