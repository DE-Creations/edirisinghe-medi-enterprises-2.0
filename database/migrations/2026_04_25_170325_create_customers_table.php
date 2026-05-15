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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('contact_no');
            $table->text('address')->nullable();
            $table->tinyInteger('is_vat')->default(0);

            // 1 = vat customer
            $table->string('company_name')->nullable();
            $table->string('nick_name')->nullable();
            $table->text('company_address')->nullable();
            $table->string('company_contact')->nullable();
            $table->string('vat_number')->nullable();
            
            $table->decimal('balance_amount', 15, 2)->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
