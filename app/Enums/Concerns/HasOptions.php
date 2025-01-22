<?php

namespace App\Enums\Concerns;

trait HasOptions
{
    public static function options(): array
    {
        return collect(self::cases())
            ->map(function ($enum) {
                return [
                    'name' => $enum->displayName(),
                    'value' => $enum->value,
                ];
            })->toArray();
    }

    abstract public function displayName(): string;
}