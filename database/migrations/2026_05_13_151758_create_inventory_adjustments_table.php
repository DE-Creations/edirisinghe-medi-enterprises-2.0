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
        Schema::create('inventory_adjustments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stock_batch_id');
            $table->unsignedBigInteger('user_id');
            $table->integer('quantity'); 
            $table->enum('type', ['sample', 'gift', 'damage', 'expiry', 'correction', 'other']);
            $table->text('description')->nullable();
            $table->date('date');
            $table->timestamps();

            $table->foreign('stock_batch_id')->references('id')->on('stock_batches')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_adjustments');
    }
};
