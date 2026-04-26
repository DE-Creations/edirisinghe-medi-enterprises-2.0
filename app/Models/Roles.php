<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    protected $fillable = [
        'name',
    ];

    public function users(): HasMany { return $this->hasMany(User::class, 'role_id'); }
}
