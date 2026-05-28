<?php

namespace App\Http\Controllers;

use App\Models\ExpensesCategory;
use Illuminate\Http\Request;

class ExpensesCategoryController extends Controller
{
    public function all()
    {
        return response()->json(ExpensesCategory::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:expenses_category,name',
        ]);

        $category = ExpensesCategory::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = ExpensesCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:expenses_category,name,' . $id,
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function delete($id)
    {
        ExpensesCategory::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
