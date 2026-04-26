<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suppliers extends Model
{
    protected $fillable = [
        'name',
        'contact_no',
        'email',
        'address',
        'company_id'
    ];

    public function company(): BelongsTo { 
        return $this->belongsTo(Company::class);    
    }

    public function grn(): HasMany { 
        return $this->hasMany(GRN::class, 'supplier_id'); 
    }
}
