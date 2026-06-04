<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grn_items extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'grn_id',
        'product_id',
        'quantity',
        'unit_price',
        'batch_number',
        'expiry_date',
        'mfd_date'
    ];

    public function grn() : BelongsTo {
        return $this->belongsTo(Grn::class, 'grn_id');
    }

    public function product() : BelongsTo {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
