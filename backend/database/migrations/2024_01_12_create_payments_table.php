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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('service_type'); // premium_dispute, legal_consultation, priority_claim, etc.
            $table->decimal('amount', 12, 2);
            $table->decimal('tax_amount', 12, 2);
            $table->decimal('total_amount', 12, 2);
            $table->string('currency')->default('INR');
            $table->string('status')->default('pending'); // pending, completed, failed, refunded
            $table->string('transaction_id')->nullable(); // External gateway ID
            $table->string('order_id')->nullable(); // gateway order ID
            $table->string('payment_method')->nullable(); // upi, card, net_banking
            $table->json('metadata')->nullable(); // Additional data (e.g., claim_id)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
