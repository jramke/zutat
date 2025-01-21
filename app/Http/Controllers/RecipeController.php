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

class RecipeController extends Controller
{
    private $extractor;

    public function __construct(RecipeExtractionService $extractor)
    {
        $this->extractor = $extractor;
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

    public function generateFromUrl(Request $request)
    {
        $limiter = RateLimiter::attempt(
            'recipe-from-url:' . $request->ip(),
            $perMinute = 5,
            fn() => null
        );

        if (!$limiter) {
            return response()->json([
                'error' => 'Too many requests. Please try again in a minute.'
            ], 429);
        }

        try {
            $data = $request->validate([
                'url' => 'required|url',
            ]);
    
            $response = Http::get($data['url']);
            if ($response->failed()) {
                return response()->json(['error' => 'Failed to fetch URL'], 400);
            }

            $html = $response->getBody();
            /** @disregard */
            $dom = \Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR);
    
            $main = $dom->querySelector('main');
            if (!$main) {
                $main = $dom->body;
            }
    
            $excludes = $main->querySelectorAll('body>header, footer, aside, nav, script, form, button, input, select, textarea, style');
            foreach ($excludes as $exclude) {
                $exclude->remove();
            }
    
            $content = $main->textContent;
            $content = preg_replace('/\s+/', ' ', $content);
    
            if (empty($content)) {
                return response()->json(['error' => 'No content could be extracted from URL'], 422);
            }
    
            $recipeData = $this->extractor->extractRecipeData($content);
            
            return response()->json([
                'url' => $data['url'],
                'data' => $recipeData,
            ]);
        } catch (\Exception $e) {
            Log::error('Recipe extraction failed', [
                'url' => $request->input('url'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to process recipe: ' . $e->getMessage()
            ], 500);
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
