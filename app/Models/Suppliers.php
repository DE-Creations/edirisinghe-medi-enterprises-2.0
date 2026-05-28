<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Suppliers extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'contact_no',
        'email',
        'address',
        'is_vat',
    ];

    public function grn(): HasMany {
        return $this->hasMany(GRN::class, 'supplier_id');
    }

    public function vatDetail(): \Illuminate\Database\Eloquent\Relations\HasOne {
        return $this->hasOne(SupplierVatDetail::class, 'supplier_id');
    }
}
