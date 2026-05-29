<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccidentPhoto extends Model
{
    protected $fillable = [
        'accident_id',
        'file_path',
        'file_type'
    ];

    public function accident(): BelongsTo
    {
        return $this->belongsTo(Accident::class);
    }
}
