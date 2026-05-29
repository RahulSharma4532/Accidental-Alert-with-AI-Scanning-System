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
        Schema::table('accidents', function (Blueprint $table) {
            $table->string('ai_damage_severity')->nullable();
            $table->json('ai_affected_parts')->nullable();
            $table->integer('ai_estimated_cost_min')->default(0);
            $table->integer('ai_estimated_cost_max')->default(0);
            $table->string('ai_assessment_status')->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accidents', function (Blueprint $table) {
            $table->dropColumn([
                'ai_damage_severity',
                'ai_affected_parts',
                'ai_estimated_cost_min',
                'ai_estimated_cost_max',
                'ai_assessment_status'
            ]);
        });
    }
};
