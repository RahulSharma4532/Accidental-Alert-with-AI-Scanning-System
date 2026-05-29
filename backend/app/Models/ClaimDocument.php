<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClaimDocument extends Model
{
    protected $fillable = [
        'claim_id',
        'doc_type',
        'file_path',
        'verified',
    ];

    public function claim()
    {
        return $this->belongsTo(Claim::class);
    }
}
