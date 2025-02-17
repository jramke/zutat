<?php
namespace App\Events;

use App\Models\Recipe;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Psr\Http\Message\UriInterface;

class RecipeExtracted
{
    use Dispatchable, SerializesModels;

    public $status;
    public $url;
    public $recipe;
    public $recipeData;
    public $errorMessage;

    /**
     * Create a new event instance.
     */
    public function __construct(string $status, string|UriInterface $url, Recipe $recipe, ?array $recipeData, ?string $errorMessage = null)
    {
        $this->status = $status;
        $this->url = $url;
        $this->recipe = $recipe;
        $this->recipeData = $recipeData;
        $this->errorMessage = $errorMessage;
    }
}