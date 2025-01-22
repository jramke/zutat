<?php

namespace App\Services;

use App\Enums\RecipeDifficulty;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;
use Illuminate\Support\Facades\Cache;

class RecipeExtractionService
{
    private $conversationMessages = [];
    // private string $websiteContent;

    public function __construct()
    {
        $this->initializeSystemPrompt();
    }

    private function initializeSystemPrompt(): void
    {
        $this->conversationMessages[] = [
            'role' => 'system',
            'content' => "You are a helpful recipe extraction assistant. You will receive recipe content from websites and answer specific questions about the recipe. Always provide concise, structured responses focused only on the asked information. Always respond in the SAME language as the recipe, also for estimated values. You will respond in JSON Format. If certain information is not available, respond with null. If the content does not include a recipe respond with null."
        ];
    }

    public function extractRecipeData(string $content): array
    {
        $this->setWebsiteContent($content);

        $cacheKey = 'complete_recipe_' . md5($content);

        if ($cachedResponse = Cache::get($cacheKey)) {
            return $cachedResponse;
        }

        // $recipeData = [
        //     ...$this->extractMetadata(),
        //     'ingredients' => $this->extractIngredients(),
        //     'instructions' => $this->extractInstructions(),
        // ];

        $recipeData = $this->askQuestion(
            "Analyze the recipe and the following data. First look for explicit information, if not available analyze the recipes ingredients and instructions to estimate. Each value MUST be in the same language as the recipe, so if the recipe is german the values also need to be german. " .
            "Provide the response in this JSON format: {" .
            "'title': 'recipe title', " .
            "'description': 'recipe description', " .
            "'servings': 'number of servings', " .
            "'prep_time': 'X minutes as number', " .
            "'cook_time': 'X minutes as number', " .
            "'difficulty': '" . RecipeDifficulty::EASY->value . "|" . RecipeDifficulty::MEDIUM->value . "|"  . RecipeDifficulty::HARD->value . "', " .
            "'nutrition_per_serving': {'calories': number, 'protein': number, 'carbs': number, 'fat': number}, " .
            "'cuisine_type': 'type of cuisine', " .
            "'instructions': 'Provide the FULL complete cooking instructions from the recipe as they are in an HTML string. Prefer an ordered list but NEVER add or skip something from the instructions', " .
            "'ingredients': 'List all ingredients with their quantities as an array of one or more groups with this format: [{'name': 'name of group', 'items': [{'item': 'ingredient name', 'quantity': 'amount', 'unit': 'measurement unit'}]}]' " .
            "}. Use null for any missing values that can not be estimated reliable. Prioritize estimated values over missing ones."
        );

        Cache::put($cacheKey, $recipeData, now()->addHours(24));

        return $recipeData;
    }

    private function setWebsiteContent(string $content): void
    {
        // $this->websiteContent = $content;
        $this->conversationMessages[] = [
            'role' => 'user',
            'content' => "Here's the recipe content to analyze: " . $content . "Respond with 'OK' to proceed." 
        ];

        $this->conversationMessages[] = [
            'role' => 'assistant',
            'content' => "{\n    \"OK\": \"Ready to proceed\"\n}"
        ];
    }

    // public function extractMetadata(): ?array
    // {
    //     return $this->askQuestion(
    //         "Analyze the recipe and provide metadata. First look for explicit information, if not available analyze the recipes ingredients and instructions to estimate. " .
    //         "Provide the response in this JSON format: {" .
    //         "'title': 'recipe title', " .
    //         "'description': 'recipe description', " .
    //         "'servings': 'number of servings', " .
    //         "'prep_time': 'X minutes as number', " .
    //         "'cook_time': 'X minutes as number', " .
    //         "'total_time': 'X minutes as number', " .
    //         "'difficulty': 'easy|medium|hard', " .
    //         "'nutrition_per_serving': {'calories': number, 'protein': number, 'carbs': number, 'fat': number, 'is_estimated': boolean}, " .
    //         "'cuisine_type': 'type of cuisine', " .
    //         "'estimated_cost': 'low|medium|high'" .
    //         "}. Use null for any missing values that can not be estimated reliable. Prioritize estimated values over missing ones."
    //     );
    // }

    // public function extractIngredients(): ?array
    // {
    //     return $this->askQuestion(
    //         "List all ingredients with their quantities. Return an NUMERICALLY INDEXED ARRAY with one or more group objects: [{'name': 'name of group', 'items': [{'item': 'ingredient name', 'quantity': 'amount', 'unit': 'measurement unit'}]}]. " .
    //         "Don't wrap in a 'groups' key. Use null for any missing values."
    //     );
    // }

    // public function extractInstructions(): ?array
    // {
    //     return $this->askQuestion(
    //         "Provide the complete cooking instructions as the similar format as its in the recipe. Return tiptap editor JSON format."
    //     );
    // }

    private function askQuestion(string $question): ?array
    {
        // // Reset conversation to only system prompt and content
        // $this->conversationMessages = array_slice($this->conversationMessages, 0, 1);
        // $this->conversationMessages[] = [
        //     'role' => 'user',
        //     'content' => "Here's the recipe content to analyze: " . $this->websiteContent
        // ];
        
        $this->conversationMessages[] = [
            'role' => 'user',
            'content' => $question
        ];

        // dd($this->conversationMessages);

        $response = OpenAI::chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => $this->conversationMessages,
            'temperature' => 0.2,
            // max_completion_tokens=2048,
            'top_p' => 1,
            'frequency_penalty' => 0,
            'presence_penalty' => 0,
            'response_format' => ['type' => 'json_object'],
        ]);

        return json_decode($response->choices[0]->message->content, true);
    }
}