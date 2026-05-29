<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Claim extends Model
{
    protected $fillable = [
        'claim_id',
        'user_id',
        'accident_id',
        'insurance_policy_id',
        'claim_type',
        'description',
        'estimated_amount',
        'status',
        'surveyor_name',
        'surveyor_phone',
        'fraud_score',
        'fraud_flags'
    ];

    protected $casts = [
        'fraud_flags' => 'array',
        'estimated_amount' => 'float'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function accident(): BelongsTo
    {
        return $this->belongsTo(Accident::class);
    }

    public function insurancePolicy(): BelongsTo
    {
        return $this->belongsTo(InsurancePolicy::class);
    }

    public function documents()
    {
        return $this->hasMany(ClaimDocument::class);
    }
}

// ---------------------------------------------------------
// InsurancePolicy Model (I'll put it in the same call but different file)
