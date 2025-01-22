<?php

namespace App\Models;

use App\Enums\RecipeDifficulty;
use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Orderable;

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
        'cuisine_type',
        'order'
    ];

    protected $slugScopeColumn = 'cookbook_id';

    protected $casts = [
        'instructions' => 'array',
        'ingredients' => 'array',
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
}
