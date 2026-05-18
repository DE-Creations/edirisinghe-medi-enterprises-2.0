<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customers;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customers::create([
            'id'         => 1,
            'name'       => 'Walk-in Customer',
            'contact_no' => '0000000000',
            'address'    => 'N/A',
            'is_vat'     => 0,
        ]);      
    }
}
