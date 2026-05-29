<?php

namespace App\Http\Controllers;

use App\Models\Accident;
use App\Models\AccidentPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AccidentController extends Controller
{
    public function index(Request $request)
    {
        return Accident::with('photos')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function recent(Request $request)
    {
        return Accident::with('photos')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'latitude' => 'required',
            'longitude' => 'required',
            'address' => 'required',
        ]);

        $accident = Accident::create([
            'user_id' => $request->user()->id,
            'report_id' => 'AR-' . strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(3)),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address,
            'accident_type' => $request->accident_type,
            'road_type' => $request->road_type,
            'weather_conditions' => $request->weather_conditions,
            'number_of_vehicles' => $request->number_of_vehicles ?? 1,
            'severity' => $request->severity,
            'has_injuries' => $request->has_injuries ?? false,
            'is_hit_and_run' => $request->is_hit_and_run ?? false,
            'other_vehicle_number' => $request->other_vehicle_number,
            'other_driver_name' => $request->other_driver_name,
            'other_driver_phone' => $request->other_driver_phone,
        ]);

        // Handle Media Uploads (Photos/Videos/Audio)
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $path = $file->store('accidents/' . $accident->id, 'public');
                AccidentPhoto::create([
                    'accident_id' => $accident->id,
                    'file_path' => $path,
                    'file_type' => $file->getClientMimeType(),
                ]);
            }
        }

        // Trigger AI Fraud Shield
        $fraudService = new \App\Services\FraudService();
        $fraudService->analyzeAccident($accident);

        // Trigger AI Damage Assessment
        $aiAssessmentService = new \App\Services\AIAssessmentService();
        $aiAssessmentService->assessDamage($accident);

        return response()->json([
            'message' => 'Accident reported successfully',
            'accident' => $accident->load('photos')
        ], 201);
    }

    public function show(Accident $accident)
    {
        return $accident->load('photos', 'claims');
    }

    /**
     * Sync offline report
     */
    public function sync(Request $request)
    {
        // For sync, we accept a simple JSON payload
        // In a real app, you'd handle base64 images here too
        $accident = Accident::create([
            'user_id' => $request->user()->id,
            'report_id' => 'AR-SYNC-' . strtoupper(Str::random(4)),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'address' => $request->address,
            'accident_type' => $request->accident_type,
            'severity' => $request->severity,
            'road_type' => $request->road_type,
            'weather_conditions' => $request->weather_conditions,
            'number_of_vehicles' => $request->number_of_vehicles,
            'has_injuries' => $request->has_injuries,
            'is_hit_and_run' => $request->is_hit_and_run,
            'other_vehicle_number' => $request->other_vehicle_number,
            'other_driver_name' => $request->other_driver_name,
            'other_driver_phone' => $request->other_driver_phone,
        ]);

        // Trigger AI Fraud Shield
        $fraudService = new \App\Services\FraudService();
        $fraudService->analyzeAccident($accident);

        // Trigger AI Damage Assessment
        $aiAssessmentService = new \App\Services\AIAssessmentService();
        $aiAssessmentService->assessDamage($accident);

        return response()->json([
            'message' => 'Report synced successfully',
            'accident' => $accident
        ], 201);
    }

    /**
     * Trigger manual AI damage assessment
     */
    public function assess(Accident $accident)
    {
        $aiAssessmentService = new \App\Services\AIAssessmentService();
        $results = $aiAssessmentService->assessDamage($accident);

        return response()->json([
            'message' => 'AI damage assessment completed successfully',
            'accident' => $accident->load('photos'),
            'results' => $results
        ]);
    }
}
