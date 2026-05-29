<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Dispute;
use Illuminate\Support\Facades\Hash;

class MediatorTestSeeder extends Seeder
{
    public function run(): void
    {
        $mediator = User::updateOrCreate(
            ['email' => 'mediator@accidentalert.com'],
            [
                'name' => 'Adv. Rajesh Kumar',
                'password' => Hash::make('password'),
                'role' => 'mediator',
                'phone' => '9988776655'
            ]
        );
        $mediator->assignRole('Arbitrator');

        $policy = \App\Models\InsurancePolicy::firstOrCreate(
            ['policy_number' => 'POL-88273'],
            [
                'user_id' => 1,
                'company' => 'SafetyFirst Insurance',
                'vehicle_number' => 'DL-3C-AS-1234',
                'coverage_type' => 'Comprehensive',
                'expiry_date' => '2025-01-01',
                'premium_amount' => 15000,
                'status' => 'Active'
            ]
        );

        $accident = \App\Models\Accident::firstOrCreate(
            ['report_id' => 'AR-2024-001'],
            [
                'user_id' => 1,
                'address' => 'Sector 62, Noida',
                'accident_type' => 'Rear End Collision',
                'severity' => 'Moderate',
                'has_injuries' => false
            ]
        );

        $claim = \App\Models\Claim::firstOrCreate(
            ['claim_id' => 'CLM-9901'],
            [
                'user_id' => 1,
                'insurance_policy_id' => $policy->id,
                'accident_id' => $accident->id,
                'claim_type' => 'Vehicle Damage',
                'description' => 'Rear end collision damage to bumper and trunk.',
                'estimated_amount' => 150000,
                'status' => 'Under Review'
            ]
        );

        Dispute::updateOrCreate(
            ['dispute_id' => 'DISP-1001'],
            [
                'claim_id' => $claim->id,
                'user_id' => 1,
                'reason' => 'Undervalued Settlement',
                'expected_amount' => 50000,
                'explanation' => 'The settlement offered is significantly lower than the medical bills provided.',
                'status' => 'Pending'
            ]
        );
        
        Dispute::updateOrCreate(
            ['dispute_id' => 'DISP-1002'],
            [
                'claim_id' => $claim->id,
                'user_id' => 2,
                'reason' => 'Delay in Processing',
                'expected_amount' => 25000,
                'explanation' => 'It has been 30 days and no update has been received on the claim.',
                'status' => 'Pending'
            ]
        );
    }
}
