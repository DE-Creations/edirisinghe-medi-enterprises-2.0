<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Vat;

class VatPercentageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Vat::create([
            'vat_percentage' => 18.00,
            'from_date' => '2024-01-01',
            'to_date' => null,
        ]);
    }
}
