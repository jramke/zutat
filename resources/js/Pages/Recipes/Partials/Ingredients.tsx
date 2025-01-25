import { useDynamicInputWidthStyle } from "@/lib/hooks/useDynamicInputWidth";
import { cn } from "@/lib/utils";
import { IngredientGroup, TODO } from "@/types";
import { ChangeEvent, FormEvent, FormEventHandler } from "react";

export default function Ingredients({ ingredients, form }: { ingredients: IngredientGroup[], form: TODO  }) {
    if (!ingredients || ingredients.length === 0) {
        return null;
    }

    const { data, setData } = form;

    const longestQuantityWithUnit = ingredients.flatMap((group) =>
        group.items.map(({ quantity, unit }) =>
            `${quantity ?? ""}${unit ?? ""}`
        )
    ).sort((a, b) => b.length - a.length)[0] ?? "";

    const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>, groupIndex: number) => {
        const newIngredients = [...ingredients];
        newIngredients[groupIndex].name = e.target.value;
        setData("ingredients", newIngredients);
    };

    const handleQuantityUnitChange = (e: ChangeEvent<HTMLInputElement>, groupIndex: number, itemIndex: number) => {
        const inputValue = e.target.value;
        const quantity = inputValue.match(/\d+(?:[.,]\d+)?|[½¼]/)?.[0] ?? "";
        const unit = inputValue.replace(quantity, "").trim();
        
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

        const newIngredient = formData.get("new-ingredient");
        if (!newIngredient) {
            return;
        }

        const newIngredients = [...ingredients];
        newIngredients[groupIndex].items.push({ item: newIngredient as string, quantity: "", unit: "" });
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
                            {group.items.map(({ item, quantity, unit }, itemIndex) => (
                                <li key={`item-${itemIndex}`}>
                                    <label className="grid gap-2.5" style={{ gridTemplateColumns: `${useDynamicInputWidthStyle(longestQuantityWithUnit, 4)} 1fr`}}>
                                        <div className="grid-col-span-1 justify-self-end flex gap-1 items-center">
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
                            ))}
                            {!data.is_locked && (
                                <li>
                                    <form className="recipe-input-highlighter" onSubmit={(e) => handleAddIngredient(e, groupIndex)}>
                                        <input
                                            name="new-ingredient"
                                            placeholder="New Ingredient"
                                            className="rounded-none border-transparent outline-none"
                                        />
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