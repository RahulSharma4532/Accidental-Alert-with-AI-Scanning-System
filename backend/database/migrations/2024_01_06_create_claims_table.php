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
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->string('claim_id')->unique(); // CLM-XXXX
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('accident_id')->constrained()->onDelete('cascade');
            $table->foreignId('insurance_policy_id')->constrained()->onDelete('cascade');
            $table->string('claim_type');
            $table->text('description');
            $table->decimal('estimated_amount', 12, 2);
            $table->string('status')->default('Submitted'); // Submitted, Under Review, Surveyor Assigned, Settled, Paid
            $table->string('surveyor_name')->nullable();
            $table->string('surveyor_phone')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
