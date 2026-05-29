<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function index(Request $request)
    {
        return Vehicle::where('user_id', $request->user()->id)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'registration_number' => 'required|unique:vehicles',
            'model' => 'required',
            'year' => 'required|numeric',
        ]);

        $vehicle = Vehicle::create([
            'user_id' => $request->user()->id,
            'registration_number' => $request->registration_number,
            'model' => $request->model,
            'year' => $request->year,
        ]);

        return response()->json($vehicle, 201);
    }
}
