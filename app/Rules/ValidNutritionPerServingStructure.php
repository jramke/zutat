<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidNutritionPerServingStructure implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!array_key_exists('calories', $value)) {
            $fail("Property calories is required.");
            return;
            if (!is_int($value['calories'])) {
                $fail("Property calories must be an integer.");
                return;
            }
        }

        if (!array_key_exists('protein', $value)) {
            $fail("Property protein is required.");
            return;
            if (!is_int($value['protein'])) {
                $fail("Property protein must be an integer.");
                return;
            }
        }

        if (!array_key_exists('carbs', $value)) {
            $fail("Property carbs is required.");
            return;
            if (!is_int($value['carbs'])) {
                $fail("Property carbs must be an integer.");
                return;
            }
        }

        if (!array_key_exists('fat', $value)) {
            $fail("Property fat is required.");
            return;
            if (!is_int($value['fat'])) {
                $fail("Property fat must be an integer.");
                return;
            }
        }

    }
}
