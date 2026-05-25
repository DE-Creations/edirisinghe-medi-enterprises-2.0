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
            $table->unsignedBigInteger('category_id');  
            $table->unsignedBigInteger('unit_type_id');             
            $table->unsignedBigInteger('brand_id');         
            $table->tinyInteger('status')->default(1);
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('unit_type_id')->references('id')->on('unit_types')->onDelete('cascade');
            $table->foreign('brand_id')->references('id')->on('brands')->onDelete('cascade');
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
