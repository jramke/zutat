<?php

namespace App\Http\Controllers;

use App\Models\Cookbook;
use Illuminate\Http\Request;
use App\Models\Recipe;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Services\Breadcrumbs;
// use Diglactic\Breadcrumbs\Breadcrumbs;

class RecipeController extends Controller
{
    public function form(Cookbook $cookbook, Recipe $recipe = null)
    {
        Breadcrumbs::generate('recipes.form', $cookbook, $recipe);

        return Inertia::render('Recipes/Form', [
            'cookbook' => $cookbook,
            'recipe' => $recipe,
        ]);
    }

    public function store(Request $request, Cookbook $cookbook)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|array',
        ]);

        $recipe = $cookbook->recipes()->create([
            'user_id' => $request->user()->id,
            ...$data,
        ]);

        return redirect()->route('recipes.form', ['cookbook' => $cookbook, 'recipe' => $recipe])->with('success', 'Recipe created successfully.');
    }

    public function update(Request $request, Cookbook $cookbook, Recipe $recipe)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|array',
        ]);

        $recipe->update($data);

        return redirect()->route('recipes.form', ['cookbook' => $cookbook, 'recipe' => $recipe])->with('success', 'Recipe updated successfully.');
    }

    public function destroy(Cookbook $cookbook, Recipe $recipe)
    {
        $recipe->delete();

        return redirect()->route('cookbooks.show', $cookbook)->with('success', 'Recipe deleted successfully.');
    }

    // // For reordering
    // public function reorder(Request $request)
    // {
    //     Recipe::reorder($request->input('items'));
    //     return response()->json(['success' => true]);
    // }

    // // For moving single items
    // public function moveRecipe(Recipe $recipe, Request $request)
    // {
    //     $recipe->moveOrder($request->input('direction')); // 'up' or 'down'
    //     return back();
    // }
}
