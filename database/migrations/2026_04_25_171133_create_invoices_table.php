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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->decimal('sub_total', 15, 2);
            $table->decimal('discount' , 15 , 2)->default(0);
            $table->decimal('grand_total', 15, 2);
            $table->decimal('paid_amount', 15, 2);
            $table->string('status')->default(1); // active, cancelled, etc.
            $table->string('customer_id');
            $table->string('user_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
