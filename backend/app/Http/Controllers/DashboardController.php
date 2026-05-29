<?php

namespace App\Http\Controllers;

use App\Models\Accident;
use App\Models\Claim;
use App\Models\Dispute;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats(Request $request)
    {
        $userId = $request->user()->id;

        $totalAccidents = Accident::where('user_id', $userId)->count();
        $activeClaims = Claim::where('user_id', $userId)->where('status', '!=', 'Settled')->count();
        $openDisputes = Dispute::where('user_id', $userId)->where('status', '!=', 'Resolved')->count();
        
        // Sum of all 'Settled' claims amount
        $amountRecovered = Claim::where('user_id', $userId)
            ->where('status', 'Settled')
            ->sum('estimated_amount');

        $vaultDocuments = \App\Models\ClaimDocument::whereHas('claim', function($q) use ($userId) {
            $q->where('user_id', $userId);
        })->count();

        // Recent Activity Feed
        $activities = [];
        
        $recentClaims = Claim::where('user_id', $userId)->latest()->take(3)->get();
        foreach ($recentClaims as $claim) {
            $activities[] = [
                'type' => 'claim',
                'title' => 'Claim #' . ($claim->claim_id ?? $claim->id) . ' update',
                'description' => 'Status changed to ' . $claim->status,
                'date' => $claim->updated_at->toIso8601String(),
                'status' => $claim->status
            ];
        }

        $recentDisputes = Dispute::where('user_id', $userId)->latest()->take(2)->get();
        foreach ($recentDisputes as $dispute) {
            $activities[] = [
                'type' => 'dispute',
                'title' => 'Dispute #' . ($dispute->dispute_id ?? $dispute->id),
                'description' => 'Current status: ' . $dispute->status,
                'date' => $dispute->updated_at->toIso8601String(),
                'status' => $dispute->status
            ];
        }

        return response()->json([
            'active_claims' => $activeClaims,
            'resolved_claims' => Claim::where('user_id', $userId)->where('status', 'Settled')->count(),
            'open_disputes' => $openDisputes,
            'vault_documents' => $vaultDocuments,
            'total_coverage' => $amountRecovered,
            'total_accidents' => $totalAccidents,
            'recent_activities' => $activities
        ]);
    }
}
