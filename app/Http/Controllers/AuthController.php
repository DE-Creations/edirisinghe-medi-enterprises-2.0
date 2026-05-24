<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use App\Models\User;
// use Illuminate\Support\Facades\Auth;
// use Illuminate\Support\Facades\Hash;

// class AuthController extends Controller
// {

//     public function login(Request $request) {
//     try {
//         $request->validate([
//             'user_name' => 'required|string',
//             'password'  => 'required|string',
//         ]);

//         $user = User::where('user_name', $request->user_name)->first();

//         // Check if user exists and password is correct
//         if (!$user || !Hash::check($request->password, $user->password)) {
//             // return response()->json([
//             //     'message' => 'Invalid username or password.'
//             // ], 401);
//             return back()->withErrors([
//                 'user_name' => 'Invalid username or password.'
//             ]);
//         }

//         // Check if user is active
//         if ($user->status == 0) {
//             // return response()->json([
//             //     'message' => 'Your account is inactive. Contact administrator.'
//             // ], 403);
//             return back()->withErrors([
//                 'user_name' => 'Your account is inactive.'
//             ]);
//         }

//         $user->tokens()->delete();
//         $token = $user->createToken('auth_token')->plainTextToken;

//         return response()->json([
//             'token' => $token,
//             'user'  => [
//                 'id'          => $user->id,
//                 'name'        => $user->name,
//                 'user_name'   => $user->user_name,
//                 'role'        => $user->role,
//                 'designation' => $user->designation,
//                 'status'      => $user->status,
//             ]
//         ]);
//     }catch (\Exception $e) {
//         return response()->json([
//             'error' => $e->getMessage(),
//             'line'  => $e->getLine(),
//             'file'  => $e->getFile(),
//         ], 500);
//     }
//     }

//     public function logout(Request $request) {

//         $request->user()->currentAccessToken()->delete();

//         return response()->json([
//             'message' => 'Logged out successfully.'
//         ]);
//     }

//     public function me(Request $request) {

//         $user = $request->user();
        
//         return response()->json([
//             'id'          => $user->id,
//             'name'        => $user->name,
//             'user_name'   => $user->user_name,
//             'role'        => $user->role,
//             'designation' => $user->designation,
//             'status'      => $user->status,
//         ]);
//     }
// }

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'user_name' => 'required|string',
            'password'  => 'required|string',
        ]);

        $user = User::where('user_name', $request->user_name)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'user_name' => 'Invalid username or password.'
            ]);
        }

        if ($user->status == 0) {
            return back()->withErrors([
                'user_name' => 'Your account is inactive.'
            ]);
        }

        // ✅ Laravel session login
        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended('/invoice');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}