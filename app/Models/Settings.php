<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $fillable = [
        'theme',
        'company_name',
        'company_address',
        'company_phone',
        'current_vat_percentage',
        'vat_effective_date'
    ];
}
