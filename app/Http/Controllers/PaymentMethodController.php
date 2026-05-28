<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;

class PaymentMethodController extends Controller
{
    public function all()
    {
        return response()->json(PaymentMethod::orderBy('name')->get());
    }
}
