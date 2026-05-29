<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all permissions from the Project Report
        $permissions = [
            // Victim / User
            'create_accident',
            'file_claim',
            'view_own_claims',
            'access_dispute_chat',
            
            // Insurance Agent
            'view_assigned_claims',
            'update_claim_status',
            'request_documents',
            
            // Police Officer
            'verify_accident',
            'add_fir_number',
            'view_accident_details',
            
            // Lawyer
            'view_assigned_dispute',
            'submit_legal_opinion',
            'download_documents',
            
            // Arbitrator / Mediator
            'view_all_disputes',
            'make_arbitration_decision',
            'close_dispute',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        // Forget cached permissions to sync memory
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles and assign permissions
        
        // 1. Victim
        $victimRole = Role::create(['name' => 'Victim', 'guard_name' => 'web']);
        $victimRole->givePermissionTo(Permission::whereIn('name', [
            'create_accident',
            'file_claim',
            'view_own_claims',
            'access_dispute_chat'
        ])->get());

        // 2. Insurance Agent
        $agentRole = Role::create(['name' => 'Insurance Agent', 'guard_name' => 'web']);
        $agentRole->givePermissionTo(Permission::whereIn('name', [
            'view_assigned_claims',
            'update_claim_status',
            'request_documents'
        ])->get());

        // 3. Police Officer
        $policeRole = Role::create(['name' => 'Police Officer', 'guard_name' => 'web']);
        $policeRole->givePermissionTo(Permission::whereIn('name', [
            'verify_accident',
            'add_fir_number',
            'view_accident_details'
        ])->get());

        // 4. Lawyer
        $lawyerRole = Role::create(['name' => 'Lawyer', 'guard_name' => 'web']);
        $lawyerRole->givePermissionTo(Permission::whereIn('name', [
            'view_assigned_dispute',
            'submit_legal_opinion',
            'download_documents'
        ])->get());

        // 5. Arbitrator
        $arbitratorRole = Role::create(['name' => 'Arbitrator', 'guard_name' => 'web']);
        $arbitratorRole->givePermissionTo(Permission::whereIn('name', [
            'view_all_disputes',
            'make_arbitration_decision',
            'close_dispute'
        ])->get());

        // 6. Super Admin
        $adminRole = Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
        $adminRole->givePermissionTo(Permission::all());
    }
}
