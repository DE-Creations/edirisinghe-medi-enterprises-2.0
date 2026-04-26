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
            $table->string('brand_name')->nullable(); 
            $table->string('sku')->unique();
            $table->string('barcode_value')->unique();
            $table->integer('reorder_level');
            $table->string('category_id');
            $table->string('unit_type_id');
            $table->string('brand_id');
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
