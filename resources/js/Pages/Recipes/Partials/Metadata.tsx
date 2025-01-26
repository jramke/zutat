import { Button } from "@/Components/ui/button";
import { FormField, FormFieldError } from "@/Components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { useDynamicInputWidthStyle } from "@/lib/hooks/useDynamicInputWidth";
import { TODO } from "@/types";
import { NumberField } from "@base-ui-components/react/number-field";
import { usePage } from "@inertiajs/react";
import { ArrowLeftRight, CircleDashed, Minus, Pentagon, Plus, Square, Triangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Metadata({ form }: { form: TODO }) {

    const { data, setData, errors } = form;

    const recipeDifficultyOptions = usePage().props.enums.recipeDifficulty.map((option) => ({
        ...option,
        icon: {
            "easy": <Triangle className="size-4 text-success/70" aria-hidden="true" />,
            "medium": <Square className="size-4 text-orange-300" aria-hidden="true" />,
            "hard": <Pentagon className="size-4 text-destructive/70" aria-hidden="true" />,
        }[option.value],
    }));

    interface MetadataField {
        // name: keyof typeof data;
        name: string;
        label: string; 
        control: () => JSX.Element;
    };

    const metadataFields: MetadataField[] = [
        { 
            name: "description", 
            label: "Description",
            control: () => (
                <textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the recipe"
                    className="w-full rounded-none border-transparent outline-none flex textarea-autosize"
                    style={{ "--min-height": "2lh" } as React.CSSProperties}
                    value={data.description}
                    onChange={(e) => {setData("description", e.target.value)}}
                    readOnly={data.is_locked}
                />
            )
        },
        { 
            name: "difficulty", 
            label: "Difficulty",
            control: () => (
                <Select
                    value={data.difficulty} 
                    onValueChange={(value) => setData("difficulty", value as string)}
                    readOnly={data.is_locked}
                >
                    <SelectTrigger className="h-auto justify-start gap-2 p-0 border-transparent outline-none !bg-transparent [&_svg[data-select-icon]]:hidden">
                        {recipeDifficultyOptions.find(option => option.value === data.difficulty)?.icon || <CircleDashed className="size-4 text-placeholder" aria-hidden="true" />}
                        {recipeDifficultyOptions.find(option => option.value === data.difficulty)?.name || <span className="text-placeholder">Choose Difficulty</span>}
                    </SelectTrigger>
                    <SelectContent className="w-[175px]">
                        {recipeDifficultyOptions.map((option) => (
                            <SelectItem 
                                key={option.value} 
                                value={option.value}
                                className="!min-w-0"
                            >
                                <span className="flex gap-2 items-center">
                                    {option.icon}
                                    {option.name}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )
        },
        {
            name: "cuisine_type",
            label: "Cuisine Type",
            control: () => (
                <input
                    id="cuisine_type"
                    name="cuisine_type"
                    placeholder="Cuisine Type"
                    className="w-full rounded-none border-transparent outline-none"
                    value={data.cuisine_type}
                    onChange={(e) => setData("cuisine_type", e.target.value)}
                    readOnly={data.is_locked}
                />
            ) 
        },
        {
            name: "prep_time",
            label: "Time",
            control: () => {
                const firstInputRef = useRef<HTMLInputElement|null>(null);
                const [showTotalTime, setShowTotalTime] = useState(true);
                
                const fulltime = Number(data.prep_time) + Number(data.cook_time);
    
                useEffect(() => {
                    if (!showTotalTime && !data.is_locked) {
                        firstInputRef.current?.focus();
                        firstInputRef.current?.select();
                    }
                }, [showTotalTime]);
    
                return (
                    <div className="flex items-center gap-3">
                        {showTotalTime ? (
                            <span onClick={() => setShowTotalTime(false)} className="cursor-default">
                                {fulltime} min
                            </span>
                        ) : (
                            <div className="flex gap-3" onClick={() => data.is_locked && setShowTotalTime(true)}>
                                <label className="flex items-baseline gap-1">
                                    <input
                                        ref={firstInputRef}
                                        id="prep_time"
                                        name="prep_time"
                                        placeholder="0"
                                        className="rounded-none border-transparent outline-none tabular-nums"
                                        style={{ 
                                            width: useDynamicInputWidthStyle(String(data.prep_time)),
                                        }}
                                        value={data.prep_time}
                                        onChange={(e) => setData("prep_time", e.target.value)}
                                        readOnly={data.is_locked}
                                    />
                                    <span className="text-xs text-muted-foreground">Prep Time</span>
                                </label>
                                <label className="flex items-baseline gap-1">
                                    <input
                                        id="cook_time"
                                        name="cook_time"
                                        placeholder="0"
                                        className="rounded-none border-transparent outline-none tabular-nums"
                                        style={{ 
                                            width: useDynamicInputWidthStyle(String(data.cook_time)),
                                        }}
                                        value={data.cook_time}
                                        onChange={(e) => setData("cook_time", e.target.value)}
                                        readOnly={data.is_locked}
                                    />
                                    <span className="text-xs text-muted-foreground">Cook Time</span>
                                </label>
                            </div>
                        )}
                        <Tooltip>
                            <TooltipTrigger render={
                                <Button type="button" size="icon" variant="secondary" className="size-[22px]" onClick={() => setShowTotalTime(!showTotalTime)}>
                                    <ArrowLeftRight aria-hidden="true" className="size-3" />
                                    <span className="sr-only">
                                        {showTotalTime ? "Switch to separate times" : "Switch to total time"}
                                    </span>
                                </Button>
                            } />
                            <TooltipContent>
                                <span className="text-muted-foreground text-xs">
                                    {showTotalTime ? "Switch to separate times" : "Switch to total time"}
                                </span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                );
            }   
        },
        {
            name: "servings",
            label: "Servings",
            control: () => {
                const value = data.is_locked ? data.scaled_servings : data.servings;
                return (
                    <NumberField.Root
                        value={value}
                        onValueChange={(value) => {
                            if (data.is_locked) {
                                setData("scaled_servings", value ?? 1);
                            } else {
                                setData("servings", value ?? 1);
                            }
                        }}
                        min={1}
                        step={1}
                        max={999}
                        smallStep={1}
                        largeStep={2}
                    >
                        <NumberField.Group className="flex items-center gap-2">
                            <NumberField.Decrement render={
                                <Button type="button" size="icon" variant="secondary" className="size-[22px]">
                                    <Minus aria-hidden="true" className="size-3" />
                                </Button>
                            } />
                            <NumberField.Input 
                                className="tabular-nums text-center outline-none" 
                                style={{ 
                                    width: useDynamicInputWidthStyle(String(value), 2),
                                }}
                            />
                            <NumberField.Increment render={
                                <Button type="button" size="icon" variant="secondary" className="size-[22px]">
                                    <Plus aria-hidden="true" className="size-3" />
                                </Button>
                            } />
                        </NumberField.Group>
                    </NumberField.Root>
                );
            }
        },
    ];
    
    return (
        <>
            {metadataFields.map((field) => (
                <FormField className="grid gap-6 grid-cols-4 text-prose-body" key={field.name}>
                    <label htmlFor={field.name} className="col-span-1 text-muted-foreground font-semibold text-sm/6">{field.label}</label>
                    <div className="recipe-input-highlighter col-span-3">
                        {field.control()}
                        <FormFieldError error={errors[field.name]} />
                    </div>
                </FormField>
            ))}
        </>
    );
}
