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
        Schema::table('claims', function (Blueprint $table) {
            $table->integer('fraud_score')->default(0);
            $table->json('fraud_flags')->nullable();
        });

        Schema::table('accidents', function (Blueprint $table) {
            $table->integer('fraud_score')->default(0);
            $table->json('fraud_flags')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('claims', function (Blueprint $table) {
            $table->dropColumn(['fraud_score', 'fraud_flags']);
        });

        Schema::table('accidents', function (Blueprint $table) {
            $table->dropColumn(['fraud_score', 'fraud_flags']);
        });
    }
};
