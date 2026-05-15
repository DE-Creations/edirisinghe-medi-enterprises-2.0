<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customers extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'contact_no',
        'address',
        'is_vat',
        'company_name',
        'nick_name',
        'company_address',
        'company_contact',
        'vat_number',
        'balance_amount',
    ];

    public function invoices(): HasMany { 
        return $this->hasMany(Invoice::class, 'customer_id'); 
    }
}
