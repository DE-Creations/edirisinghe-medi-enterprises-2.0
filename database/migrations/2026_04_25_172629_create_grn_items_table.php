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
            $table->string('grn_id');      
            $table->string('product_id'); 
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2); 
            $table->decimal('selling_price', 15, 2);   
            $table->string('batch_number')->nullable(); 
            $table->date('expiry_date')->nullable();    
            $table->date('mfd_date')->nullable();       
            $table->softDeletes();
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
