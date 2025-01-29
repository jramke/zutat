<?php

namespace App\Http\Controllers;

use App\Models\Cookbook;
use Illuminate\Http\Request;
use App\Models\Recipe;
use Inertia\Inertia;
use App\Services\Breadcrumbs;
use App\Services\RecipeExtractionService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use App\Rules\ValidIngredientStructure;
use App\Rules\ValidNutritionPerServingStructure;
use Illuminate\Support\Facades\Validator;
use Stevebauman\Purify\Facades\Purify;
use Illuminate\Validation\Rule;
use App\Enums\RecipeDifficulty;


class RecipeController extends Controller
{
    private $recipeExtractor;

    public function __construct(RecipeExtractionService $recipeExtractor)
    {
        $this->recipeExtractor = $recipeExtractor;
    }

    private function validationRules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructions' => 'nullable|string',
            'ingredients' => ['nullable', 'array', new ValidIngredientStructure],
            'nutrition_per_serving' => ['nullable', 'array', new ValidNutritionPerServingStructure],
            'servings' => 'nullable|integer|min:1',
            'prep_time' => 'nullable|integer',
            'cook_time' => 'nullable|integer',
            'difficulty' => ['nullable', Rule::enum(RecipeDifficulty::class)],
            'is_locked' => 'nullable|boolean',
        ];
    }

    private function sanitizeRecipeData(array $data): array
    {
        return [
            'title' => Purify::clean($data['title']),
            'description' => Purify::clean($data['description'] ?? null),
            'instructions' => Purify::clean($data['instructions'] ?? null),
            // 'instructions' => array_map(fn($instruction) => Purify::clean($instruction), $data['instructions'] ?? []),
            'ingredients' => array_map(fn($ingredient) => Purify::clean($ingredient), $data['ingredients'] ?? []),
            'nutrition_per_serving' => $data['nutrition_per_serving'] ?? null,
            'servings' => $data['servings'] ?? 1,
            'prep_time' => $data['prep_time'] ?? null,
            'cook_time' => $data['cook_time'] ?? null,
            'difficulty' => $data['difficulty'] ?? null,
            'is_locked' => $data['is_locked'] ?? false,
        ];
    }

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
        $data = $request->validate($this->validationRules());
        $data = $this->sanitizeRecipeData($data);

        $recipe = $cookbook->recipes()->create([
            'user_id' => $request->user()->id,
            ...$data,
        ]);

        return redirect()->route('recipes.form', ['cookbook' => $cookbook, 'recipe' => $recipe])->with('success', 'Recipe created successfully.');
    }

    public function update(Request $request, Cookbook $cookbook, Recipe $recipe)
    {
        $data = $request->validate($this->validationRules());
        $data = $this->sanitizeRecipeData($data);

        $recipe->update($data);

        return redirect()->route('recipes.form', ['cookbook' => $cookbook, 'recipe' => $recipe])->with('success', 'Recipe updated successfully.');
    }

    public function destroy(Cookbook $cookbook, Recipe $recipe)
    {
        $recipe->delete();

        return redirect()->route('cookbooks.show', $cookbook)->with('success', 'Recipe deleted successfully.');
    }

    public function generateFromUrl(Request $request, Cookbook $cookbook)
    {
        $limiter = RateLimiter::attempt(
            'recipe-from-url:' . $request->ip(),
            $perMinute = 5,
            fn() => null
        );

        if (!$limiter) {
            return back()->withErrors(['url' => 'Too many requests. Please try again in a minute.']);
        }

        try {
            $data = $request->validate([
                'url' => 'required|url',
            ]);

            $this->recipeExtractor->startCrawlingUrl($data['url']);

            // TODO: get content from the recipeExtractor via event or so
    
            // $recipeData = $this->recipeExtractor->extractRecipeData($content);
            
            // $recipeValidator = Validator::make($recipeData, $this->validationRules());

            // $validRecipeData = collect($recipeData)
            //     ->except(array_keys($recipeValidator->errors()->toArray()))
            //     ->toArray();

            // $sanitizedRecipeData = $this->sanitizeRecipeData($validRecipeData);

            // $recipe = $cookbook->recipes()->create([
            //     'user_id' => $request->user()->id,
            //     ...$sanitizedRecipeData,
            // ]);

            return redirect()
                ->route('recipes.form', [
                    'cookbook' => $cookbook, 
                    // 'recipe' => $recipe
                ])
                ->with('success', 'Recipe created successfully.');
                // ->withErrors($recipeValidator->errors());
            
        } catch (\Exception $e) {
            Log::error('Recipe extraction failed', [
                'url' => $request->input('url'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['url' => 'Failed to process recipe: ' . $e->getMessage()]);
        }

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
