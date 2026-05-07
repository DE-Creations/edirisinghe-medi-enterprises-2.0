<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function nextNumber() {

        $last = User::withTrashed()->latest()->first();
        $next = $last ? (intval(substr($last->id, 0)) + 1) : 1;
        return response()->json([
            'employee_number' => 'EMP-' . str_pad($next, 4, '0', STR_PAD_LEFT)
        ]);
    }

    public function all() {

        $users = User::with('role')->get();
        return response()->json($users);
    }

    // public function roles() {

    //     return response()->json(Role::all());
    // }

    public function store(Request $request) {

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'user_name'   => 'required|string|unique:users,user_name',
            'password'    => 'required|string|min:6',
            'mobile'      => 'required|string',
            'address'     => 'required|string',
            'designation' => 'nullable|string',
            'nic'         => 'required|string',
            'hiring_date' => 'nullable|date',
            'role'        => 'required|in:' . implode(',', UserRole::values()),
            'status'      => 'sometimes|integer',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        $user->load('role');

        return response()->json($user, 201);
    }

    public function update(Request $request, $id) {

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email,' . $id,
            'user_name'   => 'required|string|unique:users,user_name,' . $id,
            'mobile'      => 'required|string',
            'address'     => 'required|string',
            'designation' => 'nullable|string',
            'nic'         => 'required|string',
            'hiring_date' => 'nullable|date',
            'role'        => 'required|in:' . implode(',', UserRole::values()),
            'status'      => 'sometimes|integer',
            // password optional on update
            'password'    => 'nullable|string|min:6',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']); 
        }

        $user->update($validated);
        $user->load('role');

        return response()->json($user);
    }

    public function delete($id) {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Employee deleted']);
    }
}
