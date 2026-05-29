<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Claim;
use App\Models\InsurancePolicy;

class AdminAnalyticsController extends Controller
{
    public function getOverviewStats(Request $request)
    {
        // Platform metrics for super admin
        $totalUsers = User::count();
        $totalInsurers = User::where('role', 'insurer')->count();
        $activeClaims = Claim::where('status', '!=', 'Settled')->count();
        $totalRevenue = Claim::where('status', 'Settled')->sum('estimated_amount') ?? 0;

        return response()->json([
            'revenue' => '₹' . number_format($totalRevenue / 10000000, 2) . 'Cr',
            'users' => number_format($totalUsers),
            'insurers' => number_format($totalInsurers),
            'pending' => number_format($activeClaims),
        ]);
    }
}
