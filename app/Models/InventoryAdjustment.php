<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class InventoryAdjustment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'stock_batch_id',
        'user_id',
        'quantity',
        'type',
        'description',
        'date',
    ];

    public function stockBatch(): BelongsTo {
        return $this->belongsTo(StockBatches::class, 'stock_batch_id'); 
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
