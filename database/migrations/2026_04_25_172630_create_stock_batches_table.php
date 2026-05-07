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
        Schema::create('stock_batches', function (Blueprint $table) {
            $table->id();
            $table->string('batch_number')->nullable();
            $table->date('mfd')->nullable();
            $table->date('expiry_date')->nullable();
            $table->decimal('purchase_price', 15 ,2);
            $table->decimal('selling_price', 15, 2);
            $table->integer('initial_quantity');
            $table->integer('current_quantity');
            $table->foreignId('product_id')->constrained('products'); 
            $table->foreignId('grn_id')->constrained('grns');         
            $table->foreignId('user_id')->constrained('users');       
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_batches');
    }
};
