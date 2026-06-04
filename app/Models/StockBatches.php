<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockBatches extends Model
{

    protected $fillable = [
        'batch_number',
        'mfd',
        'expiry_date',
        'purchase_price',
        'initial_quantity',
        'current_quantity',
        'product_id',
        'grn_id',
        'user_id'
    ];

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function grn(): BelongsTo {
        return $this->belongsTo(Grn::class, 'grn_id');
    }

    public function inventoryAdjustments(): HasMany {
        return $this->hasMany(InventoryAdjustment::class, 'stock_batch_id');
    }

    public function invoiceItems(): HasMany {
        return $this->hasMany(InvoiceItems::class, 'stock_batch_id');
    }
}
