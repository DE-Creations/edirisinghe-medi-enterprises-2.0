<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerVatDetail extends Model
{
    protected $table = 'customers_vat_details';

    protected $fillable = [
        'customer_id',
        'company_name',
        'nick_name',
        'company_address',
        'company_contact',
        'vat_number',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customers::class, 'customer_id');
    }
}
