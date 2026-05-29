<?php

namespace App\Http\Controllers;

use App\Models\InsurancePolicy;
use Illuminate\Http\Request;

class InsurancePolicyController extends Controller
{
    public function index(Request $request)
    {
        return InsurancePolicy::where('user_id', $request->user()->id)
            ->orderBy('expiry_date', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'company' => 'required',
            'policy_number' => 'required|unique:insurance_policies',
            'vehicle_number' => 'required',
            'coverage_type' => 'required',
            'expiry_date' => 'required|date',
            'premium_amount' => 'required|numeric',
        ]);

        $policy = InsurancePolicy::create([
            'user_id' => $request->user()->id,
            'company' => $request->company,
            'policy_number' => $request->policy_number,
            'vehicle_number' => $request->vehicle_number,
            'coverage_type' => $request->coverage_type,
            'expiry_date' => $request->expiry_date,
            'premium_amount' => $request->premium_amount,
            'status' => 'Active',
        ]);

        return response()->json([
            'message' => 'Policy added successfully',
            'policy' => $policy
        ], 201);
    }
}
