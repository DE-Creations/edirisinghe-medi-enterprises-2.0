<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'generic_name', 
        'brand_name', 
        'sku', 
        'barcode_value', 
        'reorder_level', 
        'category_id', 
        'unit_type_id', 
        'brand_id', 
        'status'  
    ];

    // Get the category this product belongs to
    public function category(): BelongsTo {
        return $this->belongsTo(Category::class);
    }

    public function unitType(): BelongsTo {
        return $this->belongsTo(UnitType::class);
    }

    public function brand(): BelongsTo {
        return $this->belongsTo(Brand::class);
    }

    // Get all stock batches for this product
    public function batches(): HasMany {
        return $this->hasMany(StockBatch::class , 'product_id');
    }

    public function grnItems(): HasMany {
        return $this->hasMany(GrnItem::class, 'product_id');
    }

    // A helper to get total current stock across all batches
    // public function getTotalStockAttribute() {
    //     return $this->batches()->sum('current_quantity');
    // }
}
