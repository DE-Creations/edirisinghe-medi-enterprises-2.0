<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CreditNote extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'credit_note_number',
        'invoice_id',
        'customer_id',
        'user_id',
        'credit_note_date',
        'sub_total',
        'notes',
    ];

    public function items(): HasMany {
        return $this->hasMany(CreditNoteItems::class, 'credit_note_id');
    }

    public function invoice(): BelongsTo {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }

    public function customer(): BelongsTo {
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
