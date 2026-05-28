<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payable extends Model
{
    public $timestamps = false;

    protected $table = 'payable';

    protected $fillable = [
        'grns_id',
        'amount',
        'dateTime',
        'note',
    ];

    public function grn(): BelongsTo
    {
        return $this->belongsTo(Grn::class, 'grns_id');
    }
}
