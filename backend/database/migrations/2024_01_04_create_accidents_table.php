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
        Schema::create('accidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('report_id')->unique(); // AR-XXXX-XYZ
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->text('address')->nullable();
            $table->string('accident_type')->nullable();
            $table->string('road_type')->nullable();
            $table->string('weather_conditions')->nullable();
            $table->integer('number_of_vehicles')->default(1);
            $table->string('severity')->nullable();
            $table->boolean('has_injuries')->default(false);
            $table->boolean('is_hit_and_run')->default(false);
            
            // Other Party Info
            $table->string('other_vehicle_number')->nullable();
            $table->string('other_driver_name')->nullable();
            $table->string('other_driver_phone')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accidents');
    }
};
