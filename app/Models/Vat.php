<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vat extends Model
{
    protected $table = 'vat_percentage';

    protected $fillable = ['vat_percentage', 'from_date', 'to_date'];
}
