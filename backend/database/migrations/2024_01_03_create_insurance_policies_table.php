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
        Schema::create('insurance_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company');
            $table->string('policy_number')->unique();
            $table->string('vehicle_number');
            $table->string('coverage_type'); // Comprehensive, Third Party
            $table->date('expiry_date');
            $table->decimal('premium_amount', 10, 2);
            $table->string('status')->default('Active'); // Active, Expired, Expiring Soon
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insurance_policies');
    }
};
