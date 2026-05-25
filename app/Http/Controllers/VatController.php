<?php

namespace App\Http\Controllers;

use App\Models\Vat;
use Illuminate\Http\Request;

class VatController extends Controller
{
    public function current()
    {
        $today = now()->toDateString();

        $vat = Vat::where('from_date', '<=', $today)
            ->where(function ($q) use ($today) {
                $q->whereNull('to_date')
                  ->orWhere('to_date', '>=', $today);
            })
            ->orderBy('from_date', 'desc')
            ->first();

        return response()->json($vat);
    }

    public function byDate(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $date = $request->date;

        $vat = Vat::where('from_date', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('to_date')
                  ->orWhere('to_date', '>=', $date);
            })
            ->orderBy('from_date', 'desc')
            ->first();

        return response()->json($vat);
    }
}
