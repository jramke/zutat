<?php

namespace App\Listeners;

use App\Events\RecipeExtracted;
use App\Models\Recipe;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class HandleExtractedRecipe
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        // 
    }

    /**
     * Handle the event.
     */
    public function handle(RecipeExtracted $event): void
    {
        $recipe = $event->recipe;

        if ($event->status !== 'success') {
            Log::error("Failed to extract recipe from {$event->url}");
            $recipe->delete();
            return;
        }
        
        $recipeData = $event->recipeData;
        if (empty($recipeData)) {
            Log::error("No recipe data extracted from {$event->url}");
            $recipe->delete();
            return;
        }

        $recipeValidator = Validator::make($recipeData, Recipe::validationRules());

        $validRecipeData = collect($recipeData)
            ->except(array_keys($recipeValidator->errors()->toArray()))
            ->toArray();

        $sanitizedRecipeData = Recipe::sanitizeRecipeData($validRecipeData);

        $recipe->update([
            'is_extracting' => false, 
            ...$sanitizedRecipeData,
        ]);
    }
}