<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
    protected $fillable = [
    'name', 
    'contact_no', 
    'address', 
    'balance_amount', 
    'credit_limit'
    ];

    public function invoices(): HasMany { 
        return $this->hasMany(Invoice::class, 'customer_id'); 
    }
}
