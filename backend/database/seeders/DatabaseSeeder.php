<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Roles & Permissions
        $this->call(RolesAndPermissionsSeeder::class);

        // 2. Seed Super Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@accidentalert.com'],
            [
                'name' => 'System Administrator',
                'phone' => '0000000000',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'role' => 'admin'
            ]
        );
        $admin->assignRole('Super Admin');

        // 3. Seed Test Victim
        $user = User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Aditya Sharma',
                'phone' => '9876543210',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'role' => 'user'
            ]
        );
        $user->assignRole('Victim');

        // 3. Seed Test Insurer
        $insurer = User::updateOrCreate(
            ['email' => 'insurer@accidentalert.com'],
            [
                'name' => 'Amit Mehta (Agent)',
                'phone' => '9876543219',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'role' => 'insurer'
            ]
        );
        $insurer->assignRole('Insurance Agent');

        $policy = \App\Models\InsurancePolicy::create([
            'user_id' => $user->id,
            'company' => 'HDFC Ergo General Insurance',
            'policy_number' => 'POL-987654321',
            'vehicle_number' => 'MH-02-AB-1234',
            'coverage_type' => 'Comprehensive',
            'expiry_date' => now()->addYear(),
            'premium_amount' => 12500,
            'status' => 'Active'
        ]);

        $accident = \App\Models\Accident::create([
            'user_id' => $user->id,
            'report_id' => 'INC-A1B2C3',
            'latitude' => '19.0760',
            'longitude' => '72.8777',
            'address' => 'Western Express Highway, Mumbai',
            'accident_type' => 'Collision',
            'road_type' => 'Highway',
            'weather_conditions' => 'Clear',
            'number_of_vehicles' => 2,
            'severity' => 'Moderate',
            'has_injuries' => false,
            'is_hit_and_run' => false,
            'other_vehicle_number' => 'MH-47-XY-9876',
            'other_driver_name' => 'Rajesh Kumar',
            'other_driver_phone' => '9988776655',
            'fraud_score' => 12,
            'fraud_flags' => []
        ]);

        $claim = \App\Models\Claim::create([
            'claim_id' => 'CLM-98765-XYZ',
            'user_id' => $user->id,
            'accident_id' => $accident->id,
            'insurance_policy_id' => $policy->id,
            'claim_type' => 'Vehicle Damage',
            'description' => 'Front bumper and left headlight damaged due to rear-end collision.',
            'estimated_amount' => 45000,
            'status' => 'Pending Review',
            'fraud_score' => 8,
            'fraud_flags' => []
        ]);

        \App\Models\Dispute::create([
            'user_id' => $user->id,
            'claim_id' => $claim->id,
            'dispute_id' => 'DSP-998877',
            'reason' => 'Delayed Settlement',
            'expected_amount' => 45000,
            'explanation' => 'The claim has been pending for over 30 days without surveyor assignment.',
            'status' => 'Active'
        ]);

        $this->call([
            MediatorTestSeeder::class,
        ]);
    }
}
