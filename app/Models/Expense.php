<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'expense_number',
        'date',
        'description',
        'category_id',
        'amount',
        'notes',
        'user_id',
    ];

    public function category(): BelongsTo {
        return $this->belongsTo(ExpensesCategory::class, 'category_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}
