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
        Schema::create('credit_note_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('credit_note_id');
            $table->unsignedBigInteger('invoice_item_id');
            $table->unsignedBigInteger('stock_batch_id');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->enum('reason', ['shortage', 'damage']);
            $table->enum('stock_action', ['restock', 'reduce']);
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('credit_note_id')->references('id')->on('credit_notes')->onDelete('cascade');
            $table->foreign('invoice_item_id')->references('id')->on('invoice_items')->onDelete('cascade');
            $table->foreign('stock_batch_id')->references('id')->on('stock_batches')->onDelete('cascade');

            $table->index('credit_note_id');
            $table->index('invoice_item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_note_items');
    }
};
