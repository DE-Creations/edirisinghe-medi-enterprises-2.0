<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customers extends Model
{
    protected $fillable = [
        'name',
        'contact_no',
        'address',
        'is_vat',
        'balance_amount',
    ];

    public function invoices(): HasMany { 
        return $this->hasMany(Invoice::class, 'customer_id'); 
    }
}
