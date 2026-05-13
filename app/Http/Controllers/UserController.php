<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function nextNumber() {

        $last = User::withTrashed()->latest('id')->first();
        $next = $last ? ($last->id + 1) : 1;
        return response()->json([
            'employee_number' => 'EMP-' . str_pad($next, 4, '0', STR_PAD_LEFT)
        ]);
    }

    public function all() {

        $users = User::all();
        return response()->json($users);
    }

    public function store(Request $request) {

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'nullable|email|unique:users,email',
            'user_name'   => 'required|string|unique:users,user_name',
            'password'    => 'required|string|min:6',
            'mobile'      => 'required|string',
            'address'     => 'required|string',
            'designation' => 'nullable|string',
            'nic'         => 'required|string',
            'hiring_date' => 'nullable|date',
            'role'        => 'required|in:owner,admin,cashier',
            'status'      => 'sometimes|integer',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id) {

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'nullable|email|unique:users,email,' . $id,
            'user_name'   => 'required|string|unique:users,user_name,' . $id,
            'mobile'      => 'required|string',
            'address'     => 'required|string',
            'designation' => 'nullable|string',
            'nic'         => 'required|string',
            'hiring_date' => 'nullable|date',
            'role'        => 'required|in:owner,admin,cashier',
            'status'      => 'sometimes|integer',
            'password'    => 'nullable|string|min:6',
        ]);

        if (isset($validated['status']) && $validated['status'] == 0) {
            $user->tokens()->delete(); 
        }

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']); 
        }

        $user->update($validated);
        return response()->json($user);
    }

    public function delete($id) {

        $user = User::findOrFail($id);
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Employee deleted']);
    }
}
