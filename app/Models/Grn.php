<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grn extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'grn_number', 
        'supplier_id',
        'user_id',
        'supplier_invoice_no',
        'received_date',
        'sub_total',
        'discount',
        'total_amount', 
        'paid_amount',
        'payment_method',
        'payment_status',
        'notes'
    ];

    public function items(): HasMany { 
        return $this->hasMany(GrnItem::class , 'grn_id'); 
    }
    
    public function supplier(): BelongsTo { 
        return $this->belongsTo(Suppliers::class, 'supplier_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}
