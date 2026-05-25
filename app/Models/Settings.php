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
        'company_vat_no',
        'place_of_supply',
    ];
}
