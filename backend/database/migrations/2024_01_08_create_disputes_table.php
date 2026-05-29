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
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('claim_id')->constrained()->onDelete('cascade');
            $table->string('dispute_id')->unique();
            $table->string('reason'); // Rejected, Underpayment, Delay, Unfair Deduction, Other
            $table->decimal('expected_amount', 12, 2);
            $table->text('explanation');
            $table->string('status')->default('Raised'); // Raised, Mediator Assigned, Under Review, Hearing, Resolved
            $table->text('resolution_summary')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disputes');
    }
};
