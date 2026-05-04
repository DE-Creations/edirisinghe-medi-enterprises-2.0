<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function all()
    {
        $settings = Settings::get();
        return response()->json($settings);
    }

    public function change_theme(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'required|in:0,1',
        ]);

        $setting = Settings::first();

        if ($setting) {
            $setting->update([
                'theme' => $validated['theme'],
            ]);
        }

        return response()->json($setting, 200);
    }

    public function update_company_profile(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address' => 'required|string',
            'company_phone' => 'nullable|string|max:20',
        ]);

        $settings = Settings::first();

        $settings->update([
            'company_name' => $validated['company_name'],
            'company_address' => $validated['company_address'],
            'company_phone' => $validated['company_phone'],
        ]);

        return response()->json($settings, 200);
    }

    public function update_vat_settings(Request $request)
    {
        $validated = $request->validate([
            'current_vat_percentage' => 'required|string',
            'vat_effective_date' => 'required|date',
        ]);

        $settings = Settings::first();

        $settings->update([
            'current_vat_percentage' => $validated['current_vat_percentage'],
            'vat_effective_date' => $validated['vat_effective_date'],
        ]);

        return response()->json($settings, 200);
    }
}
