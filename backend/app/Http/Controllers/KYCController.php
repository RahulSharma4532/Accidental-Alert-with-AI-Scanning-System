<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KYCController extends Controller
{
    /**
     * Submit Aadhaar for verification (Mocked)
     */
    public function verify(Request $request)
    {
        $request->validate([
            'aadhaar_number' => 'required|string|size:12'
        ]);

        $user = $request->user();

        // Mocking an external Aadhaar API response
        // In a real app, you would use Guzzle/Http to call UIDAI or a third-party service
        
        // Simulating 90% success rate
        $isSuccess = rand(1, 100) <= 90;

        if ($isSuccess) {
            $user->update([
                'is_verified' => true,
                'aadhaar_number' => $request->aadhaar_number,
                'kyc_status' => 'Verified'
            ]);

            return response()->json([
                'message' => 'Identity verified successfully through UIDAI',
                'user' => $user
            ]);
        }

        $user->update([
            'kyc_status' => 'Rejected'
        ]);

        return response()->json([
            'message' => 'Verification failed. Please check your details and try again.',
            'status' => 'Rejected'
        ], 422);
    }

    /**
     * Get current KYC status
     */
    public function status(Request $request)
    {
        return response()->json([
            'is_verified' => $request->user()->is_verified,
            'kyc_status' => $request->user()->kyc_status
        ]);
    }
}
