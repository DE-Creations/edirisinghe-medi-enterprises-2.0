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

        return response()->json(Categories::create($validated), 201);
    }

    public function update(Request $request, $id) {

        $category = Categories::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    public function delete($id) {
        
        $category = Categories::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
