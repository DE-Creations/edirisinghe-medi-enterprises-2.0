<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvoiceItems extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'invoice_id',
        'stock_batch_id',
        'quantity',
        'unit_price', 
    ];

    public function stockBatch(): BelongsTo {
        return $this->belongsTo(StockBatches::class, 'stock_batch_id');
    }

    public function invoice(): BelongsTo {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
}
