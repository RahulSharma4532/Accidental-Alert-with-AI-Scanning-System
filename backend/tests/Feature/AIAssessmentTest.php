<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Accident;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AIAssessmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_accident_creation_triggers_ai_assessment()
    {
        $user = User::factory()->create(['phone' => '9876543210']);

        $response = $this->actingAs($user)
            ->postJson('/api/accidents', [
                'latitude' => 19.0760,
                'longitude' => 72.8777,
                'address' => 'Bandra Kurla Complex, Mumbai',
                'severity' => 'moderate',
                'accident_type' => 'collision',
                'road_type' => 'Highway',
                'weather_conditions' => 'Sunny',
                'number_of_vehicles' => 2,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'accident' => [
                    'id',
                    'ai_damage_severity',
                    'ai_affected_parts',
                    'ai_estimated_cost_min',
                    'ai_estimated_cost_max',
                    'ai_assessment_status',
                ]
            ]);

        $accident = Accident::first();
        $this->assertEquals('Moderate', $accident->ai_damage_severity);
        $this->assertEquals('completed', $accident->ai_assessment_status);
        $this->assertGreaterThan(0, $accident->ai_estimated_cost_min);
        $this->assertGreaterThan($accident->ai_estimated_cost_min, $accident->ai_estimated_cost_max);
    }

    public function test_can_manually_trigger_ai_assessment()
    {
        $user = User::factory()->create(['phone' => '9876543210']);

        $accident = Accident::create([
            'user_id' => $user->id,
            'report_id' => 'AR-TEST-123',
            'latitude' => 19.0760,
            'longitude' => 72.8777,
            'address' => 'Bandra Kurla Complex, Mumbai',
            'severity' => 'critical',
            'accident_type' => 'collision',
            'ai_assessment_status' => 'pending',
        ]);

        $response = $this->actingAs($user)
            ->postJson("/api/accidents/{$accident->id}/assess");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'accident' => [
                    'id',
                    'ai_damage_severity',
                    'ai_affected_parts',
                    'ai_estimated_cost_min',
                    'ai_estimated_cost_max',
                    'ai_assessment_status',
                ],
                'results' => [
                    'severity',
                    'affected_parts',
                    'estimated_cost_min',
                    'estimated_cost_max',
                    'recommended_action',
                    'status',
                ]
            ]);

        $accident->refresh();
        $this->assertEquals('Critical', $accident->ai_damage_severity);
        $this->assertEquals('completed', $accident->ai_assessment_status);
        $this->assertEquals(150000, $accident->ai_estimated_cost_min);
        $this->assertEquals(320000, $accident->ai_estimated_cost_max);
    }
}
