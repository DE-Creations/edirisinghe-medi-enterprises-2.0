<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('settings')->insert([
            'theme' => false,
            'company_name' => 'PharmaPOS Pharmacy',
            'company_address' => '123 Health Street, Colombo 03',
            'company_phone' => '+94 11 234 5678',
            'current_vat_percentage' => 15.00,
            'vat_effective_date' => Carbon::now()->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
