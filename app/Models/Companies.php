<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Companies extends Model
{
    protected $fillable = [
        'name', 
        'mobile', 
        'address'
    ];

    public function products(): HasMany {
        return $this->hasMany(Product::class, 'company_id');
    }

}
