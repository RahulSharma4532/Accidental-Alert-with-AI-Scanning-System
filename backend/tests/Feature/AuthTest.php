<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_send_otp()
    {
        $response = $this->postJson('/api/otp/send', [
            'phone' => '9876543210',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'phone', 'otp']);

        $otp = $response->json('otp');
        $this->assertEquals($otp, Cache::get('otp_9876543210'));
    }

    public function test_can_login_with_otp()
    {
        // First send OTP
        $sendResponse = $this->postJson('/api/otp/send', [
            'phone' => '9876543210',
        ]);
        $otp = $sendResponse->json('otp');

        // Then login with OTP
        $loginResponse = $this->postJson('/api/otp/login', [
            'phone' => '9876543210',
            'otp' => (string)$otp,
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type', 'user']);

        $user = User::where('email', '9876543210@accidentalert.in')->first();
        $this->assertNotNull($user);
        $this->assertEquals('9876543210', $user->phone);
    }

    public function test_cannot_login_with_invalid_otp()
    {
        // First send OTP
        $this->postJson('/api/otp/send', [
            'phone' => '9876543210',
        ]);

        // Then login with wrong OTP
        $loginResponse = $this->postJson('/api/otp/login', [
            'phone' => '9876543210',
            'otp' => '000000',
        ]);

        $loginResponse->assertStatus(422)
            ->assertJsonValidationErrors(['otp']);
    }

    public function test_can_login_with_google()
    {
        $response = $this->postJson('/api/auth/google', [
            'email' => 'googleuser@gmail.com',
            'name' => 'Google User',
            'google_id' => '12345678901234567890',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type', 'user']);

        $this->assertDatabaseHas('users', [
            'email' => 'googleuser@gmail.com',
            'name' => 'Google User',
        ]);
    }
}
