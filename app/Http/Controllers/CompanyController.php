<?php

namespace App\Http\Controllers;

use App\Models\Companies;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function all() {

        $companies = Companies::all();
        return response()->json($companies);
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'mobile'  => 'required|string|max:20',
            'address' => 'required|string',
        ]);

        $company = Companies::create($validated);

        return response()->json($company, 201);
    }

    public function update(Request $request, $id) {

        $company = Companies::findOrFail($id); // 404 if not found

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'mobile'  => 'required|string|max:20',
            'address' => 'required|string',
        ]);

        $company->update($validated);

        return response()->json($company);
    }

    public function delete($id) {

        $company = Companies::findOrFail($id);
        $company->delete(); // Soft delete

        return response()->json(['message' => 'Company deleted']);
    }
}
