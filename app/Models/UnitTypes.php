<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitTypes extends Model
{
    protected $fillable = [
        'name',
    ];

    public function products(): HasMany { 
        return $this->hasMany(Product::class, 'unit_type_id'); 
    }
}
