<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Suppliers extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'contact_no',
        'email',
        'address',
        'company_id'
    ];

    public function company(): BelongsTo { 
        return $this->belongsTo(Companies::class);    
    }

    public function grn(): HasMany { 
        return $this->hasMany(GRN::class, 'supplier_id'); 
    }
}
