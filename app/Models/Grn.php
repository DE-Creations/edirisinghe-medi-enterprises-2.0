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
        'payment_method_id',
        'is_vat',
        'vat_amount',
        'vat_percentage',
        'payment_status',
        'notes'
    ];

    public function items(): HasMany { 
        return $this->hasMany(Grn_items::class , 'grn_id'); 
    }

    public function payables(): HasMany {
        return $this->hasMany(Payable::class, 'grns_id');
    }
    
    public function supplier(): BelongsTo { 
        return $this->belongsTo(Suppliers::class, 'supplier_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function paymentMethod(): BelongsTo {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }
}
