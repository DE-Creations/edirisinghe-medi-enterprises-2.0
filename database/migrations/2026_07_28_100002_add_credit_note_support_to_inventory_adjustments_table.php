<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE inventory_adjustments MODIFY COLUMN type ENUM('sample', 'gift', 'damage', 'expiry', 'correction', 'other', 'credit_note') NOT NULL");

        Schema::table('inventory_adjustments', function (Blueprint $table) {
            $table->unsignedBigInteger('credit_note_id')->nullable()->after('stock_batch_id');
            $table->foreign('credit_note_id')->references('id')->on('credit_notes')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_adjustments', function (Blueprint $table) {
            $table->dropForeign(['credit_note_id']);
            $table->dropColumn('credit_note_id');
        });

        DB::statement("ALTER TABLE inventory_adjustments MODIFY COLUMN type ENUM('sample', 'gift', 'damage', 'expiry', 'correction', 'other') NOT NULL");
    }
};
