<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Accident extends Model
{
    protected $fillable = [
        'user_id',
        'report_id',
        'latitude',
        'longitude',
        'address',
        'accident_type',
        'road_type',
        'weather_conditions',
        'number_of_vehicles',
        'severity',
        'has_injuries',
        'is_hit_and_run',
        'other_vehicle_number',
        'other_driver_name',
        'other_driver_phone',
        'fraud_score',
        'fraud_flags',
        'ai_damage_severity',
        'ai_affected_parts',
        'ai_estimated_cost_min',
        'ai_estimated_cost_max',
        'ai_assessment_status'
    ];

    protected $casts = [
        'fraud_flags' => 'array',
        'ai_affected_parts' => 'array',
        'has_injuries' => 'boolean',
        'is_hit_and_run' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(AccidentPhoto::class);
    }

    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class);
    }
}
