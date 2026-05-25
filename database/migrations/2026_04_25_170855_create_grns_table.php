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
        Schema::create('grns', function (Blueprint $table) {
            $table->id();
            $table->string('grn_number')->unique();
            $table->string('supplier_id');
            $table->string('user_id');
            $table->string('supplier_invoice_no')->nullable();
            $table->dateTime('received_date');
            $table->decimal('sub_total', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->string('payment_method')->default('cash');
            $table->string('payment_status')->default('unpaid');
            $table->text('notes')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('supplier_id');
            $table->index('received_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grns');
    }
};
