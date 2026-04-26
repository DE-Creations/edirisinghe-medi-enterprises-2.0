<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $fillable = [
        'name', 
        'description'
    ];

    public function products(): HasMany {
        return $this->hasMany(Product::class, 'category_id');
    }
}
