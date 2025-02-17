<?php

namespace App\Jobs;

use App\Models\Cookbook;
use App\Models\Recipe;
use App\Services\RecipeExtractionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Psr\Http\Message\UriInterface;
use Throwable;

class CrawlRecipeUrl implements ShouldQueue
{
    use Queueable;

    private $url;
    private $recipe;
    private $recipeExtractor;

    /**
     * Create a new job instance.
     */
    public function __construct(string|UriInterface $url, Recipe $recipe)
    {
        $this->recipeExtractor = new RecipeExtractionService();
        $this->url = $url;
        $this->recipe = $recipe;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->recipeExtractor->startCrawlingUrl($this->url, $this->recipe);
    }

    /**
     * Handle a job failure.
     */
    public function failed(?Throwable $exception): void
    {
        $this->recipe->delete();
    }
}