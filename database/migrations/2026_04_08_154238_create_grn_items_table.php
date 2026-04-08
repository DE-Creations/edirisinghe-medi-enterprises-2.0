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
        Schema::create('grn_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('grn_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('batch_no');
            $table->decimal('buy_price', 10, 2);
            $table->decimal('sell_price', 10, 2);
            $table->integer('quantity');
            $table->date('manufacture_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grn_items');
    }
};
