<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Claim;
use App\Models\Accident;

class AdminSystemController extends Controller
{
    public function getHealth()
    {
        // Mocking some system metrics + getting some real counts
        return response()->json([
            'api_latency' => rand(20, 80) . 'ms',
            'db_connections' => rand(10, 50) . '/' . env('DB_MAX_CONNECTIONS', 500),
            'memory_usage' => rand(40, 65) . '%',
            'cpu_load' => rand(10, 35) . '%',
            'active_jobs' => rand(0, 5),
            'total_claims_processed' => Claim::count(),
            'total_accidents_logged' => Accident::count(),
            'status' => 'Stable',
            'last_backup' => now()->subHours(rand(1, 12))->diffForHumans()
        ]);
    }

    public function getFraud()
    {
        // Fetch claims that have fraud flags or high AI damage confidence mismatches
        // For demonstration, we'll fetch claims marked as fraudulent or just a few latest claims with mock fraud scores.
        $fraudulentClaims = Claim::with(['user', 'accident'])
            ->where('is_fraudulent', true)
            ->orWhereHas('accident', function($q) {
                $q->where('ai_fraud_score', '>', 75);
            })
            ->get()
            ->map(function ($claim) {
                return [
                    'id' => $claim->id,
                    'user_name' => $claim->user->name ?? 'Unknown',
                    'user_email' => $claim->user->email ?? 'Unknown',
                    'claim_amount' => $claim->amount,
                    'fraud_score' => $claim->accident->ai_fraud_score ?? rand(60, 95),
                    'reason' => 'AI Mismatch: Damage estimation variance > 40%',
                    'date' => $claim->created_at->format('Y-m-d')
                ];
            });

        // If no real fraud data exists, let's inject a mock one for demonstration of the UI
        if ($fraudulentClaims->isEmpty()) {
            $fraudulentClaims = collect([
                [
                    'id' => 'CLM-9912',
                    'user_name' => 'Rahul Sharma',
                    'user_email' => 'rahul@example.com',
                    'claim_amount' => 45000,
                    'fraud_score' => 88,
                    'reason' => 'Metadata Mismatch: Uploaded photo timestamp differs from incident time.',
                    'date' => now()->format('Y-m-d')
                ],
                [
                    'id' => 'CLM-8834',
                    'user_name' => 'Amit Kumar',
                    'user_email' => 'amit.k@example.com',
                    'claim_amount' => 120000,
                    'fraud_score' => 92,
                    'reason' => 'Repeat Offender: 3rd claim in 6 months from same geolocation.',
                    'date' => now()->subDays(2)->format('Y-m-d')
                ]
            ]);
        }

        return response()->json($fraudulentClaims);
    }

    public function getSettings()
    {
        // For demonstration, we can return hardcoded mock settings. 
        // In a real app, this would be from a DB table like `settings`.
        return response()->json([
            'maintenance_mode' => false,
            'auto_payouts' => true,
            'ai_strictness' => 'high',
            'platform_fee_percentage' => 2.5,
            'max_claim_auto_approve' => 50000
        ]);
    }

    public function updateSettings(Request $request)
    {
        // Here you would save to DB. We will just return success.
        return response()->json(['success' => true, 'message' => 'Settings updated successfully']);
    }
}
