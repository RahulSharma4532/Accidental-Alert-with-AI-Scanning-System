<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'claim_id',
        'mediator_id',
        'dispute_id',
        'reason',
        'expected_amount',
        'explanation',
        'status',
        'resolution_summary',
        'signature_data'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function claim()
    {
        return $this->belongsTo(Claim::class);
    }

    public function messages()
    {
        return $this->hasMany(DisputeMessage::class);
    }
}
