<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('generic_name');
            $table->string('sku')->unique();
            $table->string('barcode_value')->unique();
            $table->integer('reorder_level');
            $table->foreignId('category_id')->constrained('categories');  
            $table->foreignId('unit_type_id')->constrained('unit_types'); 
            $table->foreignId('brand_id')->constrained('brands');         
            $table->tinyInteger('status')->default(1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
