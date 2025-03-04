<?php

namespace App\Jobs;

use App\Models\Cookbook;
use App\Models\Recipe;
use App\Services\RecipeExtractionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Psr\Http\Message\UriInterface;
use Throwable;

class CrawlRecipeUrl implements ShouldQueue
{
    use Queueable;

    private $url;
    private $recipe;
    private $recipeExtractor;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 1;

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
        Log::error("CrawlRecipeUrl job failed ", ['exception' => $exception]);
        $this->recipe->delete();
    }
}