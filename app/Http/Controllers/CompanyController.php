<?php

namespace App\Http\Controllers;

use App\Models\Companies;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function all() {

        return response()->json(Companies::all());
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'mobile'  => 'required|string|max:20',
            'address' => 'required|string',
        ]);

        return response()->json(Companies::create($validated), 201);
    }

    public function update(Request $request, $id) {

        $company = Companies::findOrFail($id); 

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'mobile'  => 'required|string|max:20',
            'address' => 'required|string',
        ]);

        $company->update($validated);
        return response()->json($company);
    }

    public function delete($id) {

        Companies::findorFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
