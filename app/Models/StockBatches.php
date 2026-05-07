<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockBatches extends Model
{
    protected $fillable = [
        'product_id',
        'grn_id',
        'batch_number',
        'expiry_date',
        'mfd_date',
        'purchase_price',
        'selling_price',
        'initial_quantity',
        'current_quantity',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'mfd_date' => 'date',
    ];

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function grn(): BelongsTo {
        return $this->belongsTo(GRN::class, 'grn_id');
    }

    public function inventoryAdjustments(): HasMany {
        return $this->hasMany(InventoryAdjustments::class, 'stock_batch_id');
    }

    public function invoiceItems(): HasMany {
        return $this->hasMany(InvoiceItems::class, 'stock_batch_id');
    }
}
