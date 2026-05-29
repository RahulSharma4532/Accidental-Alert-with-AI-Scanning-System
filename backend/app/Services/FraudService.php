<?php

namespace App\Services;

use App\Models\Claim;
use App\Models\Accident;
use Carbon\Carbon;

class FraudService
{
    /**
     * Analyze a claim for potential fraud
     */
    public function analyzeClaim(Claim $claim)
    {
        $score = 0;
        $flags = [];

        // Check 1: Duplicate Vehicle Claim (Same vehicle, multiple claims in 30 days)
        $vehicleNumber = $claim->insurancePolicy->vehicle_number;
        $duplicateClaims = Claim::whereHas('insurancePolicy', function ($query) use ($vehicleNumber) {
                $query->where('vehicle_number', $vehicleNumber);
            })
            ->where('id', '!=', $claim->id)
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->count();

        if ($duplicateClaims > 0) {
            $score += 40;
            $flags[] = 'Duplicate vehicle claim within 30 days';
        }

        // Check 2: GPS Collision (Another accident at same coords in 1 hour)
        $accident = $claim->accident;
        if ($accident && $accident->latitude && $accident->longitude) {
            $nearbyAccidents = Accident::where('id', '!=', $accident->id)
                ->where('latitude', $accident->latitude)
                ->where('longitude', $accident->longitude)
                ->where('created_at', '>=', $accident->created_at->subHour())
                ->where('created_at', '<=', $accident->created_at->addHour())
                ->count();

            if ($nearbyAccidents > 0) {
                $score += 30;
                $flags[] = 'Multiple accidents reported at identical GPS coordinates';
            }
        }

        // Check 3: Suspiciously High Amount
        if ($claim->estimated_amount > 500000) {
            $score += 15;
            $flags[] = 'High value claim threshold exceeded';
        }

        // Check 4: Night-time reporting (Staged accidents often reported late)
        $hour = $claim->created_at->format('H');
        if ($hour >= 23 || $hour <= 4) {
            $score += 10;
            $flags[] = 'Late-night reporting window';
        }

        $claim->update([
            'fraud_score' => $score,
            'fraud_flags' => $flags
        ]);

        return [
            'score' => $score,
            'flags' => $flags
        ];
    }

    /**
     * Analyze an accident report for potential fraud
     */
    public function analyzeAccident(Accident $accident)
    {
        $score = 0;
        $flags = [];

        // Similar GPS check
        if ($accident->latitude && $accident->longitude) {
            $duplicate = Accident::where('id', '!=', $accident->id)
                ->where('latitude', $accident->latitude)
                ->where('longitude', $accident->longitude)
                ->where('created_at', '>=', Carbon::now()->subMinutes(10))
                ->count();

            if ($duplicate > 0) {
                $score += 50;
                $flags[] = 'Rapid succession reporting at same location';
            }
        }

        $accident->update([
            'fraud_score' => $score,
            'fraud_flags' => $flags
        ]);

        return [
            'score' => $score,
            'flags' => $flags
        ];
    }
}
