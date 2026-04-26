<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvoiceItems extends Model
{
   protected $fillable = [
        'quantity', 
        'unit_price', 
        'invoice_id', 
        'stock_batch_id',   
    ];

    public function batch(): BelongsTo {
        return $this->belongsTo(StockBatch::class);
    }

    public function invoice(): BelongsTo {
        return $this->belongsTo(Invoice::class);
    }
}
