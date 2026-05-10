<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'generic_name', 
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
        return $this->belongsTo(Categories::class, 'category_id');
    }

    public function unitType(): BelongsTo {
        return $this->belongsTo(UnitTypes::class, 'unit_type_id');
    }

    public function brand(): BelongsTo {
        return $this->belongsTo(Brands::class, 'brand_id');
    }

    // Get all stock batches for this product
    public function stockBatches(): HasMany {
        return $this->hasMany(StockBatches::class , 'product_id');
    }

    public function grnItems(): HasMany {
        return $this->hasMany(Grn_Items::class, 'product_id');
    }
}
