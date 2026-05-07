<?php

namespace App\Enums;

enum UserRole: string
{
    case Owner   = 'owner';
    case Admin   = 'admin';
    case Cashier = 'cashier';

    public function label(): string
    {
        return match($this) {
            UserRole::Owner   => 'Owner',
            UserRole::Admin   => 'Admin',
            UserRole::Cashier => 'Cashier',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}