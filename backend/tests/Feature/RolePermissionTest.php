<?php

namespace Tests\Feature;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RolePermissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed the database
        $this->seed();
    }

    public function test_roles_and_permissions_are_correctly_seeded()
    {
        // Assert roles exist
        $this->assertTrue(Role::where('name', 'Victim')->exists());
        $this->assertTrue(Role::where('name', 'Insurance Agent')->exists());
        $this->assertTrue(Role::where('name', 'Arbitrator')->exists());
        $this->assertTrue(Role::where('name', 'Police Officer')->exists());
        $this->assertTrue(Role::where('name', 'Lawyer')->exists());
        $this->assertTrue(Role::where('name', 'Super Admin')->exists());

        // Assert permissions exist
        $this->assertTrue(Permission::where('name', 'create_accident')->exists());
        $this->assertTrue(Permission::where('name', 'file_claim')->exists());
        $this->assertTrue(Permission::where('name', 'view_assigned_claims')->exists());
        $this->assertTrue(Permission::where('name', 'make_arbitration_decision')->exists());
    }

    public function test_test_users_have_correct_roles()
    {
        // 1. Aditya Sharma should be a Victim
        $victim = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($victim);
        $this->assertTrue($victim->hasRole('Victim'));
        $this->assertTrue($victim->hasPermissionTo('create_accident'));
        $this->assertFalse($victim->hasPermissionTo('view_assigned_claims'));

        // 2. Amit Mehta should be an Insurance Agent
        $insurer = User::where('email', 'insurer@accidentalert.com')->first();
        $this->assertNotNull($insurer);
        $this->assertTrue($insurer->hasRole('Insurance Agent'));
        $this->assertTrue($insurer->hasPermissionTo('view_assigned_claims'));
        $this->assertFalse($insurer->hasPermissionTo('create_accident'));

        // 3. Adv. Rajesh Kumar should be an Arbitrator
        $mediator = User::where('email', 'mediator@accidentalert.com')->first();
        $this->assertNotNull($mediator);
        $this->assertTrue($mediator->hasRole('Arbitrator'));
        $this->assertTrue($mediator->hasPermissionTo('make_arbitration_decision'));
        $this->assertFalse($mediator->hasPermissionTo('file_claim'));
    }
}
