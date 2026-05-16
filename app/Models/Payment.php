<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'reference_type',
        'reference_id',
        'amount',
        'date',
        'notes',
        'user_id',
    ];   
    
    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }    
}
