<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create first owner account
        User::create([
            'name'        => 'Sarath Edirisinghe',
            'email'       => 'sarath@test.com',
            'user_name'   => 'sarath',
            'password'    => Hash::make('password123'),
            'mobile'      => '0711234455',
            'address'     => 'Colombo',
            'designation' => 'CEO',
            'nic'         => '123456789V',
            'role'        => 'owner',
            'status'      => 1,
        ]);
    }
}
