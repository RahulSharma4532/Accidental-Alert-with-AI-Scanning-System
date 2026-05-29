<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class B2BController extends Controller
{
    /**
     * Generate or Refresh API Token for the Insurer
     */
    public function generateToken(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'Insurer') {
            return response()->json(['message' => 'Unauthorized. B2B access only for insurers.'], 403);
        }

        $token = Str::random(60);
        $user->update(['api_token' => $token]);

        return response()->json([
            'message' => 'B2B API Token generated successfully',
            'api_token' => $token
        ]);
    }

    /**
     * External API Endpoint: Fetch Claims for this Insurer
     */
    public function fetchClaims(Request $request)
    {
        $token = $request->header('X-B2B-Token');
        if (!$token) {
            return response()->json(['message' => 'Missing X-B2B-Token header'], 401);
        }

        $insurer = User::where('api_token', $token)->where('role', 'Insurer')->first();
        if (!$insurer) {
            return response()->json(['message' => 'Invalid or expired B2B token'], 401);
        }

        // Fetch claims linked to this insurer's company
        $claims = Claim::whereHas('insurancePolicy', function($query) use ($insurer) {
                $query->where('company', $insurer->company_name);
            })
            ->with(['user', 'accident', 'insurancePolicy'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'company' => $insurer->company_name,
            'claim_count' => $claims->count(),
            'claims' => $claims
        ]);
    }
}
