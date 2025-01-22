<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidIngredientStructure implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // dd($value);
        foreach ($value as $group) {
            if (!array_key_exists('name', $group)) {
                $fail("The group name needs to be set.");
                return;
            }
            if (!isset($group['items']) || !is_array($group['items'])) {
                $fail("The group items are required.");
                return;
            }
            foreach ($group['items'] as $item) {
                if (!array_key_exists('item', $item) || !array_key_exists('quantity', $item) || !array_key_exists('unit', $item)) {
                    $fail("Each item must have an item, quantity, and unit.");
                    return;
                }
            }
        }
    }
}
