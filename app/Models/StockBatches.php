<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockBatches extends Model
{
    protected $fillable = [
        'batch_number', 
        'mfd', 
        'expiry_date', 
        'purchase_price', 
        'selling_price', 
        'initial_quantity', 
        'current_quantity', 
        'product_id', 
        'grn_id', 
        'user_id'
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'mfd' => 'date',
    ];

    public function product(): BelongsTo {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function grn(): BelongsTo {
        return $this->belongsTo(GRN::class);
    }

    public function inventoryAdjustments(): HasMany {
        return $this->hasMany(InventoryAdjustments::class, 'stock_batch_id');
    }

    public function invoiceItems(): HasMany {
        return $this->hasMany(InvoiceItems::class, 'stock_batch_id');
    }
}
