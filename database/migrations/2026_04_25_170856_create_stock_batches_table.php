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
            $table->decimal('purchase_price', 15, 2);
            $table->integer('initial_quantity');
            $table->integer('current_quantity');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('grn_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->index('product_id');
            $table->index('current_quantity');

            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->foreign('grn_id')->references('id')->on('grns')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
