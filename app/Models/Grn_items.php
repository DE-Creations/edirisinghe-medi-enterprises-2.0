<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grn_items extends Model
{
    protected $fillable = [
        'grn_id', 
        'product_id', 
        'quantity', 
        'unit_price'
    ];

    public function grn() : BelongsTo {
        return $this->belongsTo(Grn::class, 'grn_id');
    }

    public function product() : BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }

}
