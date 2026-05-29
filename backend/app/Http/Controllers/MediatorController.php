<?php

namespace App\Http\Controllers;

use App\Models\Dispute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MediatorController extends Controller
{
    /**
     * Get statistics for the mediator dashboard
     */
    public function getStats(Request $request)
    {
        $user = $request->user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);
        
        $mediatorId = $user->id;

        return response()->json([
            'stats' => [
                'totalAssigned' => Dispute::where('mediator_id', $mediatorId)->count(),
                'activeCases' => Dispute::where('mediator_id', $mediatorId)->whereNotIn('status', ['Resolved'])->count(),
                'resolvedCases' => Dispute::where('mediator_id', $mediatorId)->where('status', 'Resolved')->count(),
                'pendingQueue' => Dispute::whereNull('mediator_id')->count(),
            ],
            'recentActivity' => Dispute::with(['user', 'claim'])
                ->where('mediator_id', $mediatorId)
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($dispute) {
                    return [
                        'id' => $dispute->id,
                        'title' => 'Case ' . ($dispute->dispute_id ?? 'N/A'),
                        'description' => 'Status updated to ' . ($dispute->status ?? 'Raised'),
                        'time' => $dispute->updated_at ? $dispute->updated_at->diffForHumans() : 'Just now',
                        'status' => $dispute->status
                    ];
                })
        ]);
    }

    /**
     * List disputes for mediators
     */
    public function getDisputes(Request $request)
    {
        $query = Dispute::with(['user', 'claim.insurancePolicy']);
        
        $type = $request->query('type', 'assigned'); // assigned or pending

        if ($type === 'pending') {
            $query->whereNull('mediator_id');
        } else {
            $query->where('mediator_id', $request->user()->id);
        }

        return $query->latest()->get();
    }

    /**
     * Assign a dispute to the current mediator
     */
    public function assignDispute(Request $request, Dispute $dispute)
    {
        if ($dispute->mediator_id) {
            return response()->json(['message' => 'Dispute already assigned'], 422);
        }

        $dispute->update([
            'mediator_id' => $request->user()->id,
            'status' => 'Mediator Assigned'
        ]);

        // Notify User
        \App\Models\Notification::create([
            'user_id' => $dispute->user_id,
            'type' => 'legal_alert',
            'title' => 'Mediator Assigned',
            'message' => "A legal mediator has been assigned to your dispute: {$dispute->dispute_id}",
            'action_url' => "/disputes/{$dispute->id}"
        ]);

        return response()->json([
            'message' => 'Dispute assigned successfully',
            'dispute' => $dispute->load(['user', 'claim.insurancePolicy'])
        ]);
    }

    /**
     * Update dispute status
     */
    public function updateStatus(Request $request, Dispute $dispute)
    {
        $request->validate([
            'status' => 'required|in:Under Review,Hearing,Resolved'
        ]);

        $dispute->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Status updated successfully',
            'dispute' => $dispute
        ]);
    }

    /**
     * Resolve a dispute with a final decision
     */
    public function resolveDispute(Request $request, Dispute $dispute)
    {
        $request->validate([
            'resolution_summary' => 'required|string',
            'awarded_amount' => 'required|numeric',
            'signature_data' => 'required|string'
        ]);

        $dispute->update([
            'status' => 'Resolved',
            'resolution_summary' => $request->resolution_summary,
            'expected_amount' => $request->awarded_amount, // Update final amount
            'signature_data' => $request->signature_data
        ]);

        // Notify User
        \App\Models\Notification::create([
            'user_id' => $dispute->user_id,
            'type' => 'payment_received',
            'title' => 'Dispute Resolved',
            'message' => "Your dispute {$dispute->dispute_id} has been resolved with a final award of ₹{$request->awarded_amount}.",
            'action_url' => "/disputes/{$dispute->id}"
        ]);

        return response()->json([
            'message' => 'Dispute resolved successfully',
            'dispute' => $dispute
        ]);
    }
}
