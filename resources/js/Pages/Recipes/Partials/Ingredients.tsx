import { useDynamicInputWidthStyle } from "@/lib/hooks/useDynamicInputWidth";
import { cn } from "@/lib/utils";
import { IngredientGroup, TODO } from "@/types";
import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useState } from "react";

export default function Ingredients({ ingredients, form }: { ingredients: IngredientGroup[], form: TODO  }) {
    if (!ingredients || ingredients.length === 0) {
        return null;
    }

    const { data, setData } = form;

    const [newIngredientQuantity, setNewIngredientQuantity] = useState("");
    const [newIngredientUnit, setNewIngredientUnit] = useState("");

    const handleNewIngredientQuantityChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const inputValue = e.target.value;
        const { quantity, unit } = getQuantityAndUnit(inputValue);
        setNewIngredientQuantity(quantity);
        setNewIngredientUnit(unit);
    };

    const parseQuantityToNumber = (quantity: string): number => {
        if (!quantity) return 0;
    
        // Normalize fractions and mixed fractions
        const fractionRegex = /(\d+)\s+(\d+)\/(\d+)/; // Matches mixed fractions like "3 1/4"
        const properFractionRegex = /(\d+)\/(\d+)/;   // Matches proper fractions like "1/2"
        const unicodeFractionMap: { [key: string]: number } = {
            "½": 0.5,
            "¼": 0.25,
            "¾": 0.75,
            "⅓": 1 / 3,
            "⅔": 2 / 3,
            "⅕": 1 / 5,
            "⅖": 2 / 5,
            "⅗": 3 / 5,
            "⅘": 4 / 5,
            "⅙": 1 / 6,
            "⅚": 5 / 6,
            "⅛": 1 / 8,
            "⅜": 3 / 8,
            "⅝": 5 / 8,
            "⅞": 7 / 8,
        };
    
        // Handle mixed fractions (e.g., "3 1/4")
        const mixedMatch = quantity.match(fractionRegex);
        if (mixedMatch) {
            const [_, whole, numerator, denominator] = mixedMatch;
            return parseInt(whole, 10) + parseInt(numerator, 10) / parseInt(denominator, 10);
        }
    
        // Handle proper fractions (e.g., "1/2")
        const fractionMatch = quantity.match(properFractionRegex);
        if (fractionMatch) {
            const [_, numerator, denominator] = fractionMatch;
            return parseInt(numerator, 10) / parseInt(denominator, 10);
        }
    
        // Handle Unicode fractions (e.g., "½", "¼")
        if (unicodeFractionMap[quantity]) {
            return unicodeFractionMap[quantity];
        }
    
        // Handle decimals or integers (e.g., "1.5", "2")
        const normalizedQuantity = quantity.replace(",", "."); // Normalize decimal separator
        const numericValue = parseFloat(normalizedQuantity);
    
        // Return the parsed numeric value or 0 if invalid
        return isNaN(numericValue) ? 0 : numericValue;
    };

    const getScaledQuantity = (quantity: string) => {
        if (!quantity) {
            return "";
        }
        return String((parseQuantityToNumber(quantity) / data.servings * data.scaled_servings).toFixed(2)).replace('.00', '');
    };

    const flatIngredientsWithNew = [...ingredients.flatMap((group) =>
        group.items.map(({ quantity, unit }) => {
            if (data.is_locked) {
                quantity = getScaledQuantity(quantity);
            }
            return `${quantity ?? ""} ${unit ?? ""}`;
        })
    ), `${newIngredientQuantity} ${newIngredientUnit}`];
    const longestQuantityWithUnit = flatIngredientsWithNew.sort((a, b) => b.length - a.length)[0] ?? "";

    const getQuantityAndUnit = (inputValue: string) => {
        // Match fractions (e.g., "1/2", "¾"), decimals (e.g., "1.5", "0.75"), and integers (e.g., "2")
        const quantityMatch = inputValue.match(
            /(?:([½¼¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])|(\d+\s\d+\/\d+)|(\d+\/\d+)|(\d+(?:[.,]\d+)?)|(\d+))/
        );
    
        let quantity = "";
        if (quantityMatch) {
            const [match] = quantityMatch;
            quantity = match.replace(",", "."); // Normalize decimal separator
        }
    
        // Extract the unit by removing the matched quantity
        const unit = inputValue.replace(quantity, "").trimStart();
    
        return { quantity, unit };
    };

    const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>, groupIndex: number) => {
        const newIngredients = [...ingredients];
        newIngredients[groupIndex].name = e.target.value;
        setData("ingredients", newIngredients);
    };

    const handleQuantityUnitChange = (e: ChangeEvent<HTMLInputElement>, groupIndex: number, itemIndex: number) => {
        const inputValue = e.target.value;
        const { quantity, unit } = getQuantityAndUnit(inputValue);

        const newIngredients = [...ingredients];

        newIngredients[groupIndex].items[itemIndex].quantity = quantity;
        newIngredients[groupIndex].items[itemIndex].unit = unit;
        setData("ingredients", newIngredients);
    };

    const renderQuantityUnit = (quantity: string, unit: string) => {
        if (!quantity && !unit) {
            return "";
        }

        if (!quantity) {
            return unit;
        }

        if (data.is_locked) {
            quantity = getScaledQuantity(quantity);
        }

        if (!unit) {
            return quantity;
        }

        return `${quantity} ${unit}`;
    };

    const handleItemChange = (e: ChangeEvent<HTMLInputElement>, groupIndex: number, itemIndex: number) => {
        const item = e.target.value;
        const newIngredients = [...ingredients];
        newIngredients[groupIndex].items[itemIndex].item = item;
        setData("ingredients", newIngredients);
    };

    const handleAddIngredient = (e: FormEvent, groupIndex: number) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const newIngredient = formData.get("new-ingredient") as string;
        
        if (!newIngredient) {
            return;
        }

        const newQuantityUnit = formData.get("new-amount-unit") as string;
        const { quantity, unit } = getQuantityAndUnit(newQuantityUnit ?? "");

        const newIngredients = [...ingredients];
        newIngredients[groupIndex].items.push({ item: newIngredient, quantity, unit });
        setData("ingredients", newIngredients);
        form.reset();
    };

    const handleAddGroup: FormEventHandler = (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const newGroupName = formData.get("new-ingredient-group");
        if (!newGroupName) {
            return;
        }

        const newIngredients = [...ingredients];
        newIngredients.push({ name: newGroupName as string, items: [] });
        setData("ingredients", newIngredients);
        form.reset();
    };
    
    return (
        <>
            {ingredients.map((group, groupIndex) => {        
                return (
                    <div key={`group-${groupIndex}`}>
                        <div className={cn(
                            "recipe-input-highlighter mb-4",
                        )}>
                            <input
                                className="rounded-none border-transparent outline-none heading w-full"
                                value={group.name || "Infredients"}
                                onChange={(e) => handleGroupNameChange(e, groupIndex)}
                            />
                        </div>
                        <ul className="space-y-3">
                            {group.items.map(({ item, quantity, unit }, itemIndex) => {
                                // TODO: handle enter key to jump to next input
                                return (
                                    <li key={`item-${itemIndex}`}>
                                        <label className="grid gap-2.5" style={{ gridTemplateColumns: `${useDynamicInputWidthStyle(longestQuantityWithUnit, 4)} 1fr`}}>
                                            <div className="grid-col-span-1 justify-self-end w-full">
                                                <div className={"recipe-input-highlighter after:-inset-x-1.5 after:-inset-y-1"}>
                                                    <input 
                                                        className="w-full rounded-none border-transparent outline-none font-semibold tabular-nums text-right"
                                                        value={renderQuantityUnit(quantity, unit)}
                                                        onChange={(e) => handleQuantityUnitChange(e, groupIndex, itemIndex)}
                                                        readOnly={data.is_locked}
                                                    />
                                                </div>
                                            </div>
                                            <div className={"recipe-input-highlighter after:-inset-x-1.5 after:-inset-y-1"}>
                                                <input 
                                                    className="w-full rounded-none border-transparent outline-none"
                                                    value={item}
                                                    onChange={(e) => handleItemChange(e, groupIndex, itemIndex)}
                                                    readOnly={data.is_locked}
                                                />
                                            </div>
                                        </label>
                                    </li>
                                );
                            })}
                            {!data.is_locked && (
                                <li>
                                    <form onSubmit={(e) => handleAddIngredient(e, groupIndex)}>
                                        {/* the hidden submit is needed so the form submits on enter if there are 2 fields */}
                                        <input type="submit" className="hidden" tabIndex={-1} />
                                        <div className="grid gap-2.5" style={{ gridTemplateColumns: `${useDynamicInputWidthStyle(longestQuantityWithUnit, 4)} 1fr`}}>
                                            <div className="recipe-input-highlighter grid-col-span-1 justify-self-end">
                                                <input
                                                    name="new-amount-unit"
                                                    placeholder=""
                                                    onChange={handleNewIngredientQuantityChange}
                                                    className="w-full rounded-none border-transparent outline-none font-semibold tabular-nums text-right"
                                                />
                                            </div>
                                            <div className="recipe-input-highlighter">
                                                <input
                                                    name="new-ingredient"
                                                    placeholder="New Ingredient"
                                                    className="w-full rounded-none border-transparent outline-none"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </li>
                            )}
                        </ul>
                    </div>
                )
            })}
            {!data.is_locked && (
                <form className="recipe-input-highlighter" onSubmit={handleAddGroup}>
                    <input
                        name="new-ingredient-group"
                        placeholder="New Group"
                        className="rounded-none border-transparent outline-none heading placeholder:text-prose-body/50"
                    />
                </form>
            )}
        </>
    );
}