<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplierVatDetail extends Model
{
    protected $fillable = [
        'supplier_id',
        'company_name',
        'nick_name',
        'company_address',
        'company_contact',
        'vat_number',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Suppliers::class, 'supplier_id');
    }
}
