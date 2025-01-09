<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recipe;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    // public function index(Request $request): Response
    // {
    //     return Inertia::render('Recipes/Index', [
    //         'recipes' => Recipe::where('user_id', $request->user()->id)->get(),
    //     ]);
    // }

    // public function show(Cookbook $cookbook, Recipe $recipe)
    // {
    //     // Route will automatically use slugs
    //     return view('recipes.show', compact('cookbook', 'recipe'));
    // }

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
