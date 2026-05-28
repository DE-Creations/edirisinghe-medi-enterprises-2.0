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
            'company_name' => 'Edirisinghe Medi Enterprises',
            'company_address' => '343/A, Thunnana, Hanwella, Sri Lanka',
            'company_phone' => '0777471563',
            'company_vat_no' => '1026589348 - 7000',
            'place_of_supply' => 'Thunnana',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
