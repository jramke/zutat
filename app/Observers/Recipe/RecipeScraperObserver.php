<?php

namespace App\Observers\Recipe;

use App\Events\RecipeExtracted;
use App\Models\Recipe;
use App\Services\RecipeExtractionService;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use Spatie\Crawler\CrawlObservers\CrawlObserver;

class RecipeScraperObserver extends CrawlObserver
{
    private $url;
    private $recipe;
    private $content;
    private $recipeExtractor;

    public function __construct(string|UriInterface $url, Recipe $recipe)
    {
        $this->url = $url;
        $this->recipe = $recipe;
        $this->content = null;
        $this->recipeExtractor = new RecipeExtractionService();
    }

    /*
     * Called when the crawler will crawl the url.
     */
    public function willCrawl(UriInterface $url, ?string $linkText): void
    {
        Log::info('willCrawl', ['url' => $url]);
    }

    /*
     * Called when the crawler has crawled the given url successfully.
     */
    public function crawled(
        UriInterface $url,
        ResponseInterface $response,
        ?UriInterface $foundOnUrl = null,
        ?string $linkText = null,
    ): void {
        Log::info("Crawled: {$url}");
        
        try {
            $this->content = $this->recipeExtractor->getContentFromResponse($response);
        } catch (\Exception $e) {
            Log::error("Error extracting content: " . $e->getMessage());
            $this->content = null;
        }
    }

    /*
     * Called when the crawler had a problem crawling the given url.
     */
    public function crawlFailed(
        UriInterface $url,
        RequestException $requestException,
        ?UriInterface $foundOnUrl = null,
        ?string $linkText = null,
    ): void {
        Log::error("Failed: {$url}", ['exception' => $requestException]);

        event(new RecipeExtracted(
            status: 'failed',
            url: $url,
            recipe: $this->recipe,
            recipeData: null,
            errorMessage: $requestException->getMessage()
        ));
    }

    /*
     * Called when the crawl has ended.
     */
    public function finishedCrawling(): void
    {
        Log::info("Finished crawling: {$this->url}");

        if ($this->content) {
            try {
                $recipeData = $this->recipeExtractor->extractRecipeData($this->content);
                event(new RecipeExtracted(
                    status: 'success',
                    url: $this->url,
                    recipe: $this->recipe,
                    recipeData: $recipeData,
                ));

            } catch (\Exception $e) {
                Log::error("Error extracting recipe data: " . $e->getMessage());
                event(new RecipeExtracted(
                    status: 'failed',
                    url: $this->url,
                    recipe: $this->recipe,
                    recipeData: null,
                    errorMessage: $e->getMessage()
                ));
            }
            return;
        }

        event(new RecipeExtracted(
            status: 'failed',
            url: $this->url,
            recipe: $this->recipe,
            recipeData: null,
            errorMessage: 'No content could be extracted from URL'
        ));
    }
}