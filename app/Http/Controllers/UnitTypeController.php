<?php

namespace App\Http\Controllers;

use App\Models\UnitTypes;
use Illuminate\Http\Request;

class UnitTypeController extends Controller
{
    public function all() {
        return response()->json(UnitTypes::all());
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $unitType = UnitTypes::create($validated);
        return response()->json($unitType, 201);
    }
}
