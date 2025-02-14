<?php

namespace App\Models;

use App\Enums\RecipeDifficulty;
use App\Traits\HasSlug;
use App\Traits\Orderable;
use App\Rules\ValidIngredientStructure;
use App\Rules\ValidNutritionPerServingStructure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rule;
use Stevebauman\Purify\Facades\Purify;

class Recipe extends Model
{
    use Orderable, HasSlug;

    protected $fillable = [
        'user_id', 
        'title', 
        'description', 
        'instructions', 
        'ingredients', 
        'prep_time', 
        'cook_time', 
        'servings',
        'difficulty',
        'is_locked',
        'nutrition_per_serving',
        'order',
        'is_extracting',
    ];

    protected $slugScopeColumn = 'cookbook_id';

    protected $casts = [
        // 'instructions' => 'array',
        'ingredients' => 'array',
        'nutrition_per_serving' => 'array',
        'is_locked' => 'boolean',
        'is_extracting' => 'boolean',
        // 'difficulty' => RecipeDifficulty::class,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cookbook()
    {
        return $this->belongsTo(Cookbook::class);
    }

    static public function validationRules(): array
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
            'is_extracting' => 'nullable|boolean',
        ];
    }

    static public function sanitizeRecipeData(array $data): array
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
            'is_extracting' => $data['is_extracting'] ?? false,
        ];
    }

    static public function createExtractingPlaceholderRecipe(Cookbook $cookbook) {
        return $cookbook->recipes()->create([
            'user_id' => $cookbook->user->id,
            'title' => 'Extracting recipe...',
            'is_extracting' => true,
        ]);
    }
}