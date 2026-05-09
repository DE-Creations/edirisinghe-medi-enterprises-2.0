<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompanyProfile;

class CompanyProfileController extends Controller
{
    public function show() {

        return response()->json(CompanyProfile::first());
    }

    public function update(Request $request) {

        $request->validate([
            'company_name' => 'required|string|max:255',
            'address'      => 'required|string',
            'tin_number'   => 'required|string',
            'phone_number' => 'required|string',
        ]);

        $profile = CompanyProfile::updateOrCreate(
            ['id' => 1],
            $request->only(['company_name', 'address', 'tin_number', 'phone_number'])
        );

        return response()->json($profile);
    }
}
