<?php

namespace App\Services;

use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Cache;

class RecipeExtractionService
{
    private $conversationMessages = [];
    private string $websiteContent;

    public function __construct()
    {
        $this->initializeSystemPrompt();
    }

    private function initializeSystemPrompt(): void
    {
        $this->conversationMessages[] = [
            'role' => 'system',
            'content' => "You are a helpful recipe extraction assistant. You will receive recipe content from websites and answer specific questions about the recipe. Always provide concise, structured responses focused only on the asked information. You will respond in JSON Format. Do not format the JSON code with markdown backticks, just answer with the JSON string. If certain information is not available, respond with null."
        ];
    }

    public function extractRecipeData(string $content): array
    {
        $this->websiteContent = $content;

        $cacheKey = 'complete_recipe_' . md5($content);

        if ($cachedResponse = Cache::get($cacheKey)) {
            return $cachedResponse;
        }

        $recipeData = [
            'metadata' => $this->extractMetadata(),
            'ingredients' => $this->extractIngredients(),
            'instructions' => $this->extractInstructions(),
        ];

        Cache::put($cacheKey, $recipeData, now()->addHours(24));

        return $recipeData;
    }

    public function setWebsiteContent(string $content): void
    {
        $this->websiteContent = $content;
        $this->conversationMessages[] = [
            'role' => 'user',
            'content' => "Here's the recipe content to analyze: " . $content
        ];
    }

    public function extractMetadata(): ?array
    {
        return $this->askQuestion(
            "Analyze the recipe and provide metadata. First look for explicit information, if not available analyze the recipes ingredients and instructions to estimate. " .
            "Provide the response in this JSON format: {" .
            "'title': 'recipe title', " .
            "'description': 'recipe description', " .
            "'servings': 'number of servings', " .
            "'prep_time': 'X minutes as number', " .
            "'cook_time': 'X minutes as number', " .
            "'total_time': 'X minutes as number', " .
            "'difficulty': 'easy|medium|hard', " .
            "'nutrition_per_serving': {'calories': number, 'protein': number, 'carbs': number, 'fat': number, 'is_estimated': boolean}, " .
            "'cuisine_type': 'type of cuisine', " .
            "'dietary_info': ['vegetarian', 'vegan', 'gluten-free', etc], " .
            "'estimated_cost': 'low|medium|high'" .
            "}. Use null for any missing values that can not be estimated reliable. Prioritize estimated values over missing ones."
        );
    }

    public function extractIngredients(): ?array
    {
        return $this->askQuestion(
            "List all ingredients with their quantities. Provide the response in this JSON format: " .
            "[{'item': 'ingredient name', 'quantity': 'amount', 'unit': 'measurement unit'}]. " .
            "Use null for any missing values."
        );
    }

    public function extractInstructions(): ?array
    {
        return $this->askQuestion(
            "Provide the complete cooking instructions as the similar format as its in the recipe. Return tiptap editor JSON format."
        );
    }

    private function askQuestion(string $question): ?array
    {
        // Reset conversation to only system prompt and content
        $this->conversationMessages = array_slice($this->conversationMessages, 0, 1);
        $this->conversationMessages[] = [
            'role' => 'user',
            'content' => "Here's the recipe content to analyze: " . $this->websiteContent
        ];
        
        $this->conversationMessages[] = [
            'role' => 'user',
            'content' => $question
        ];

        $response = OpenAI::chat()->create([
            'model' => 'gpt-4-turbo-preview',
            'messages' => $this->conversationMessages,
            'temperature' => 0.2,
            'response_format' => ['type' => 'json_object'],
        ]);

        return json_decode($response->choices[0]->message->content, true);
    }
}