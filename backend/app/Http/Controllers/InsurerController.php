<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\Dispute;
use Illuminate\Http\Request;

class InsurerController extends Controller
{
    public function getClaims(Request $request)
    {
        $insurer = $request->user();
        if ($insurer->role !== 'insurer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Fetch claims where the policy matches the insurer's company
        return Claim::with(['user', 'accident', 'insurancePolicy'])
            ->whereHas('insurancePolicy', function ($query) use ($insurer) {
                $query->where('company', $insurer->company_name);
            })
            ->latest()
            ->get();
    }

    public function updateClaimStatus(Request $request, Claim $claim)
    {
        $insurer = $request->user();
        if ($insurer->role !== 'insurer') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'status' => 'required|string',
            'amount' => 'nullable|numeric'
        ]);

        $claim->update([
            'status' => $request->status,
            'amount' => $request->amount ?? $claim->amount
        ]);

        // Notify User
        \App\Models\Notification::create([
            'user_id' => $claim->user_id,
            'type' => 'claim_update',
            'title' => 'Claim Status Updated',
            'message' => "Your claim {$claim->claim_id} status has been updated to: {$request->status}.",
            'action_url' => "/claims/{$claim->id}"
        ]);

        return response()->json([
            'message' => 'Claim status updated successfully',
            'claim' => $claim
        ]);
    }

    public function getStats(Request $request)
    {
        $insurer = $request->user();
        // Return stats specifically for this company
        // (Implementation similar to DashboardController but scoped to company)
    }
}
