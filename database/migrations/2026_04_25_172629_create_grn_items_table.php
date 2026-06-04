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
            $table->unsignedBigInteger('grn_id');      
            $table->unsignedBigInteger('product_id'); 
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);   
            $table->string('batch_number')->nullable(); 
            $table->date('expiry_date')->nullable();    
            $table->date('mfd_date')->nullable();       
            $table->softDeletes();
            $table->timestamps();

            $table->index('product_id');
            $table->foreign('grn_id')->references('id')->on('grns')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
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
