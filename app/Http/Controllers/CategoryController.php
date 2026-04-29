<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function all() {
        return response()->json(Categories::all());
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $category = Categories::create($validated);
        return response()->json($category, 201);
    }
}
