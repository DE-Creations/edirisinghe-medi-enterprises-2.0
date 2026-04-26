<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brands extends Model
{
    protected $fillable = [
        'name',
    ];

    public function products(): HasMany { 
        return $this->hasMany(Product::class, 'brand_id'); 
    }
}
