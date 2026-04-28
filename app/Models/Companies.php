<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Companies extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 
        'mobile', 
        'address'
    ];

    public function suppliers(): HasMany {
        return $this->hasMany(Suppliers::class, 'company_id');
    }

    protected static function booted() {
        static::deleting(function ($company) {
            $company->suppliers()->delete(); // Soft delete related suppliers
        });
    }

}
