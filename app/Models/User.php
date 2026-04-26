<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name', 
        'email', 
        'user_name', 
        'password', 
        'mobile', 
        'address', 
        'designation', 
        'nic', 
        'hiring_date', 
        'role_id', 
        'status'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role(): BelongsTo { 
        return $this->belongsTo(Role::class); 
    }

    public function stockBatches(): HasMany {
        return $this->hasMany(StockBatch::class , 'user_id');
    }

    public function invoices(): HasMany {
        return $this->hasMany(Invoice::class , 'user_id');
    }

    public function grns(): HasMany {
        return $this->hasMany(GRN::class , 'user_id');
    }
}
