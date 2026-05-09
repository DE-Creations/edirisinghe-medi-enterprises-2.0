<?php

namespace App\Http\Controllers;

use App\Models\Brands;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function all() {
        return response()->json(Brands::all());
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $brand = Brands::create($validated);
        return response()->json($brand, 201);
    }

    public function update(Request $request, $id) {

        $brand = Brands::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $brand->update($validated);
        return response()->json($brand);
    }

    public function delete($id) {

        Brands::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
