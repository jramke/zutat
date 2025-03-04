<?php

namespace App\Services;

use App\Enums\RecipeDifficulty;
use App\Models\Recipe;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Cache;
use Psr\Http\Message\ResponseInterface;
use App\Observers\Recipe\RecipeScraperObserver;
use Illuminate\Support\Facades\Log;
use Psr\Http\Message\UriInterface;
use Spatie\Crawler\Crawler;
use Spatie\Browsershot\Browsershot;

class RecipeExtractionService
{
    private $conversationMessages = [];

    public function __construct()
    {
        $this->initializeSystemPrompt();
    }

    private function initializeSystemPrompt(): void
    {
        $this->conversationMessages[] = [
            'role' => 'system',
            'content' => "You are a helpful recipe extraction assistant. You will receive recipe content from websites and answer specific questions about the recipe. Always provide concise, structured responses focused only on the asked information. Always respond in the SAME language as the recipe, also for estimated values. You will respond in JSON Format. If certain information is not available, respond with the value null not the string 'null'. If the content does not include a recipe respond with null."
        ];
    }

    public function startCrawlingUrl(string|UriInterface $url, Recipe $recipe): void
    {
        Log::info('Start crawling');
        $browsershot = (new Browsershot())
            ->addChromiumArguments([
                'no-sandbox', 
                'disable-setuid-sandbox', 
                'disable-dev-shm-usage',
                'disable-gpu',
            ])
            ->newHeadless()
            // ->timeout(300)
            ->userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            ->setEnvironmentOptions([
                'LANG' => 'en-US',
            ])
            ->waitUntilNetworkIdle();
        
        if (app()->isProduction()) {
            $browsershot->setIncludePath('$PATH:/root/.nix-profile/bin');
        }
        
        Log::info('Browsershot configured');

        $crawler = Crawler::create()
            ->setCrawlObserver(new RecipeScraperObserver($url, $recipe))
            ->setBrowsershot($browsershot)
            ->executeJavaScript()
            ->setMaximumDepth(0)
            ->setTotalCrawlLimit(1);
        
        Log::info('Crawler created');
        
        $crawler->startCrawling($url);

        Log::info('Crawler started');
    }

    // TODO: use dom api (uncommented) if nixpacks supports php 8.4
    public function getContentFromResponse(ResponseInterface $response): string
    {
        $html = $response->getBody();

        // /** @disregard */
        // $dom = \Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR);
        $dom = new \DOMDocument();
        $dom->loadHTML($html, LIBXML_NOERROR);

        $xpath = new \DOMXPath($dom);

        // TODO: first search for srcipt tag with schema.org/Recipe

        // $main = $dom->querySelector('main');
        // if (!$main) {
        //     $main = $dom->body;
        // }
        $main = $xpath->query('//main')->item(0);
        if (!$main) {
            $main = $dom->getElementsByTagName('body')->item(0);
        }

        // $excludes = $main->querySelectorAll('body>header, footer, aside, nav, script, form, button, input, select, textarea, style');
        // foreach ($excludes as $exclude) {
        //     $exclude->remove();
        // }
        $excludeSelectors = [
            'header', 'footer', 'aside', 'nav', 'script',
            'form', 'button', 'input', 'select', 'textarea', 'style'
        ];
        foreach ($excludeSelectors as $selector) {
            foreach ($xpath->query("//body/{$selector}") as $exclude) {
                $exclude->parentNode->removeChild($exclude);
            }
        }

        $content = $main ? $main->textContent : '';
        $content = preg_replace('/\s+/', ' ', $content);
        $content = mb_convert_encoding($content, 'UTF-8', 'auto');

        if (empty($content)) {
            throw new \Exception('No content could be extracted from URL');
        }
        
        return $content;
    }

    public function extractRecipeData(string $content): array
    {
        $this->setWebsiteContent($content);

        $cacheKey = 'complete_recipe_' . md5($content);

        if ($cachedResponse = Cache::get($cacheKey)) {
            return $cachedResponse;
        }

        $recipeData = $this->askQuestion(
            "Analyze the recipe and the following data. First look for explicit information, if not available analyze the recipes ingredients and instructions to estimate. Each value MUST be in the same language as the recipe, so if the recipe is german the values also need to be german. " .
            "Provide the response in this JSON format: {" .
            "'title': 'recipe title', " .
            "'description': 'recipe description', " .
            "'servings': 'X number of servings ONLY AS AN INTEGER', " .
            "'prep_time': 'X minutes as number', " .
            "'cook_time': 'X minutes as number', " .
            "'difficulty': '" . RecipeDifficulty::EASY->value . "|" . RecipeDifficulty::MEDIUM->value . "|"  . RecipeDifficulty::HARD->value . "', " .
            "'nutrition_per_serving': {'calories': number, 'protein': number, 'carbs': number, 'fat': number}, " .
            // "'instructions': 'Provide the FULL complete cooking instructions from the recipe as they are in an HTML string. Prefer an ordered list but NEVER add or skip something from the instructions. Wrap the content of each <li> item in a <p> to match prosemirror format', " .
            "'instructions': 'Provide the FULL complete cooking instructions from the recipe as they are as an HTML string with an appropiate format. Seperate each step into a single paragraph', " .
            "'ingredients': 'List all ingredients with their quantities as an array of one or more groups with this format: [{'name': 'name of group', 'items': [{'item': 'ingredient name', 'quantity': 'amount', 'unit': 'measurement unit'}]}]' " .
            "}. Use null for any missing values that can not be estimated reliable. Prioritize estimated values over missing ones."
        );

        Cache::put($cacheKey, $recipeData, now()->addHours(24));

        // fix recursive all "null" strings in the ingredients array
        $recipeData['ingredients'] = json_decode(str_replace('"null"', 'null', json_encode($recipeData['ingredients'])), true);

        return $recipeData;
    }

    private function setWebsiteContent(string $content): void
    {
        $this->conversationMessages[] = [
            'role' => 'user',
            'content' => "Here's the recipe content to analyze: " . $content . "Respond with 'OK' to proceed." 
        ];

        $this->conversationMessages[] = [
            'role' => 'assistant',
            'content' => "{\n    \"OK\": \"Ready to proceed\"\n}"
        ];
    }

    private function askQuestion(string $question): ?array
    {
        $this->conversationMessages[] = [
            'role' => 'user',
            'content' => $question
        ];

        $response = OpenAI::chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => $this->conversationMessages,
            'temperature' => 0.2,
            'top_p' => 1,
            'frequency_penalty' => 0,
            'presence_penalty' => 0,
            'response_format' => ['type' => 'json_object'],
        ]);

        return json_decode($response->choices[0]->message->content, true);
    }
}