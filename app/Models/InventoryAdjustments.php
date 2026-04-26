<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryAdjustments extends Model
{
    protected $fillable = [
        'stock_batches_id', 
        'quantity', 
        'type', 
        'date'
    ];

    public function stockBatch(): BelongsTo {
             return $this->belongsTo(StockBatches::class); 
    }
}
