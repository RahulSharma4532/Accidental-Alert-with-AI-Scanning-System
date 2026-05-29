<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => [
                'required',
                'string',
                'min:10',
                function ($attribute, $value, $fail) {
                    $hash = hash('sha256', $value);
                    if (User::where('phone_hash', $hash)->exists()) {
                        $fail('The phone number has already been taken.');
                    }
                }
            ],
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:10',
        ]);

        $phone = $request->phone;
        // Generate a random 6-digit OTP
        // If there is already an active OTP for this phone, reuse it to prevent issues with delayed SMS and multiple requests.
        $existingOtp = Cache::get('otp_' . $phone);
        if ($existingOtp) {
            $otp = $existingOtp;
        } else {
            $otp = rand(100000, 999999);
            // Store OTP in Cache for 10 minutes to allow for SMS delays
            Cache::put('otp_' . $phone, $otp, now()->addMinutes(10));
        }

        $twilioSid = env('TWILIO_SID');
        $twilioAuthToken = env('TWILIO_AUTH_TOKEN');
        $twilioPhoneNumber = env('TWILIO_PHONE_NUMBER');
        
        $twilioConfigured = !empty($twilioSid) && !empty($twilioAuthToken) && !empty($twilioPhoneNumber);
        $smsSent = false;
        $errorMessage = null;

        if ($twilioConfigured) {
            try {
                $formattedPhone = $phone;
                if (!str_starts_with($phone, '+')) {
                    $formattedPhone = '+91' . $phone;
                }
                
                $response = Http::asForm()
                    ->withBasicAuth($twilioSid, $twilioAuthToken)
                    ->post("https://api.twilio.com/2010-04-01/Accounts/{$twilioSid}/Messages.json", [
                        'To' => $formattedPhone,
                        'From' => $twilioPhoneNumber,
                        'Body' => "AccidentAlert Security Code: Your OTP verification code is {$otp}. It is valid for 5 minutes. Do not share this code.",
                    ]);

                if ($response->successful()) {
                    $smsSent = true;
                } else {
                    $errorMessage = $response->json('message') ?? 'Twilio API returned an error';
                }
            } catch (\Exception $e) {
                $errorMessage = $e->getMessage();
            }
        }

        return response()->json([
            'message' => $smsSent ? 'OTP sent successfully to your mobile phone' : 'OTP generated (local fallback)',
            'phone' => $phone,
            'otp' => !$smsSent ? $otp : null,
            'twilio_configured' => $twilioConfigured,
            'sms_sent' => $smsSent,
            'error' => $errorMessage
        ]);
    }

    public function loginWithOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:10',
            'otp' => 'required|string|size:6',
        ]);

        $phone = $request->phone;
        $otp = $request->otp;

        $cachedOtp = Cache::get('otp_' . $phone);

        if (!$cachedOtp || (string)$cachedOtp !== (string)$otp) {
            throw ValidationException::withMessages([
                'otp' => ['The provided OTP is invalid or has expired.'],
            ]);
        }

        // OTP is correct, invalidate it
        Cache::forget('otp_' . $phone);

        // Find or create the user using phone_hash
        $user = User::where('phone_hash', hash('sha256', $phone))->first();

        if (!$user) {
            $user = User::create([
                'name' => 'Victim User ' . substr($phone, -4),
                'email' => $phone . '@accidentalert.in',
                'phone' => $phone,
                'password' => Hash::make(Str::random(16)),
                'role' => 'victim',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function loginWithGoogle(Request $request)
    {
        if ($request->has('credential')) {
            $token = $request->credential;
            
            $response = Http::get("https://oauth2.googleapis.com/tokeninfo", [
                'id_token' => $token,
            ]);
            
            if ($response->failed()) {
                throw ValidationException::withMessages([
                    'credential' => ['Invalid Google login credential.'],
                ]);
            }
            
            $payload = $response->json();
            
            $clientId = env('GOOGLE_CLIENT_ID');
            if ($clientId && $payload['aud'] !== $clientId) {
                throw ValidationException::withMessages([
                    'credential' => ['Google credential client ID mismatch.'],
                ]);
            }
            
            $email = $payload['email'];
            $name = $payload['name'] ?? 'Google User';
            $googleId = $payload['sub'];
            $avatar = $payload['picture'] ?? null;
        } else {
            $request->validate([
                'email' => 'required|email',
                'name' => 'required|string',
                'google_id' => 'required|string',
                'avatar' => 'nullable|string',
            ]);
            
            $email = $request->email;
            $name = $request->name;
            $googleId = $request->google_id;
            $avatar = $request->avatar;
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'phone' => 'G-' . substr($googleId, 0, 8),
                'password' => Hash::make(Str::random(16)),
                'role' => 'victim',
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function googleConfig()
    {
        return response()->json([
            'client_id' => env('GOOGLE_CLIENT_ID')
        ]);
    }
}
