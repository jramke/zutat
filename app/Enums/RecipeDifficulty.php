<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum RecipeDifficulty: string
{
    use HasOptions;

    case EASY = 'easy';
    case MEDIUM = 'medium';
    case HARD = 'hard';

    public function displayName(): string
    {
        return match ($this) {
            self::EASY => 'Easy',
            self::MEDIUM => 'Medium',
            self::HARD => 'Hard',
        };
    }
}