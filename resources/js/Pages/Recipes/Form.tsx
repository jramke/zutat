import { LoadingButton } from "@/Components/LoadingButton";
import {
    FormField,
    FormFieldError,
    FormFieldLabel,
} from "@/Components/ui/form-field";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Cookbook, PageProps, Recipe } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, ReactNode, useEffect, useId, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { useEditor, Editor } from "@/Components/Editor";
import * as Portal from "@radix-ui/react-portal";
import { useNavbarAction } from "@/lib/hooks/useNavbarAction";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select";
import { ArrowLeftRight, CircleDashed, Minus, Pentagon, Plus, Square, Triangle, Lock, LockOpen } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { NumberField } from '@base-ui-components/react/number-field';
import { Toggle } from '@base-ui-components/react/toggle';
import { useDynamicInputWidthStyle } from "@/lib/hooks/useDynamicInputWidth";

export default function Create({
    cookbook,
    recipe,
}: PageProps<{ cookbook: Cookbook, recipe: Recipe|null }>) {
    const isEditing = !!recipe;
    const titleInputRef = useRef<HTMLInputElement|null>(null);
    const navbarActionEl = useNavbarAction();
    const formRef = useRef<HTMLFormElement|null>(null);

    // TODO: handle error messages from automatic recipe creation with usePage().props.errors

    const recipeDifficultyOptions = usePage().props.enums.recipeDifficulty.map((option) => ({
        ...option,
        icon: {
            "easy": <Triangle className="size-4 text-success/70" aria-hidden="true" />,
            "medium": <Square className="size-4 text-orange-300" aria-hidden="true" />,
            "hard": <Pentagon className="size-4 text-destructive/70" aria-hidden="true" />,
        }[option.value],
    }));

    let initialIngredients = recipe?.ingredients ?? [];
    if (initialIngredients.length === 0) {
        initialIngredients = [{ name: "Ingredients", items: [] }];
    }

    const { data, setData, post, patch,  processing, errors, reset, clearErrors, transform, isDirty } = useForm({
        title: recipe?.title ?? "",
        description: recipe?.description ?? "",
        instructions: recipe?.instructions ?? null,
        ingredients: initialIngredients,
        cuisine_type: recipe?.cuisine_type ?? "",
        difficulty: recipe?.difficulty ?? null,
        prep_time: recipe?.prep_time ?? "",
        cook_time: recipe?.cook_time ?? "",
        servings: recipe?.servings ?? 1,
        is_locked: recipe?.is_locked ?? false,
    });

    const editor = useEditor({ 
        content: data.instructions, 
        cookbook, 
        locked: data.is_locked, 
        onUpdate: ({ editor }) => setData("instructions", editor.getHTML() || null), 
    }, [data.is_locked]);

    if (!editor) {
        return null;
    }

    // useEffect(() => {
    //     editor.setEditable(!data.is_locked);
    // }, [data.is_locked]);

    const abortController = new AbortController();
    useEffect(() => {

        if (!data.title) {
            titleInputRef.current?.focus();
        }

        window.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                submit();
            }
        });

        return () => {
            abortController.abort();
        };
    }, []);

    function submit() {
        formRef.current?.requestSubmit();
    }

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const method = isEditing ? patch : post;
        const routeName = isEditing ? "recipes.update" : "recipes.store";

        // transform((data) => {
        //     return {
        //         ...data,
        //         instructions: editor?.getHTML() || null,
        //     };
        // });

        method(route(routeName, { cookbook, recipe }), {
            preserveScroll: true,
            onBefore: (e) => {
                console.log('before submit', e);
            },
            onError: (e) => {
                // TODO:
                console.log(e);
            },
            onSuccess: () => {
                clearErrors();
            },
        });
    };

    const metadataFields: Array<{name: keyof typeof data, label: string, control: () => JSX.Element}> = [
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
                return (
                    <NumberField.Root
                        value={data.servings}
                        onValueChange={(value) => setData("servings", value ?? 1)}
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
                                    // width: `max(calc(${String(data.servings ?? 1).length}ch + 0.1ch), 2ch)`,
                                    width: useDynamicInputWidthStyle(String(data.servings), 2),
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
        <AuthenticatedLayout>
            <Head title={recipe?.title || "New Recipe"} />
            <div className="content-grid">
                <form ref={formRef} onSubmit={onSubmit} className="not-prose space-y-6" id="recipe-editor-form">
                    <FormField>
                        <FormFieldLabel className="sr-only">Title</FormFieldLabel>
                        <input
                            ref={titleInputRef}
                            id="title"
                            name="title"
                            placeholder="New Recipe"
                            className="w-full heading rounded-none border-transparent outline-none"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            required
                            readOnly={data.is_locked}
                        />
                        <FormFieldError error={errors.title} />
                    </FormField>

                    {metadataFields.map((field) => (
                        <FormField className="grid gap-6 grid-cols-4 text-prose-body" key={field.name}>
                            <label htmlFor={field.name} className="col-span-1 text-muted-foreground font-semibold text-sm/6">{field.label}</label>
                            <div className={cn(
                                "col-span-3 relative isolate",
                                "after:-inset-x-2 after:-inset-y-1.5 after:absolute after:z-[-1] after:rounded after:transition-[background] after:ring-offset-background",
                                "hover:after:bg-muted focus-within:after:bg-muted",
                                // "focus-within:after:ring-2 focus-within:after:ring-ring focus-within:after:ring-offset-2"
                            )}>
                                {field.control()}
                                <FormFieldError error={errors[field.name]} />
                            </div>
                        </FormField>
                    ))}

                    {/* TODO: replace with base-ui portal if released */}
                    <Portal.Root container={navbarActionEl}>
                        <div className="flex gap-2">
                            {isEditing && (
                                <Toggle 
                                    pressed={data.is_locked}
                                    onPressedChange={(isLocked) => {
                                        setData("is_locked", isLocked);
                                        if (isLocked) {
                                            setTimeout(() => {
                                                submit();
                                            }, 0);
                                        }
                                    }}
                                    aria-label="Lock Recipe"
                                    render={(props, state) => (
                                        <Button variant="secondary" {...props}>
                                            {state.pressed ? (
                                                <>
                                                    Locked
                                                    <Lock aria-hidden="true" className="size-4" />
                                                </>
                                            ) : (
                                                <>
                                                    Editable
                                                    <LockOpen aria-hidden="true" className="size-4" />
                                                </>
                                            )}
                                        </Button>
                                    )} 
                                />                          
                            )}
                            <Tooltip>
                                <TooltipTrigger render={
                                    <LoadingButton disabled={data.is_locked} form="recipe-editor-form" loading={processing}>{isEditing ? "Save" : "Create"}</LoadingButton>
                                } />
                                <TooltipContent>
                                    <span className="text-muted-foreground text-xs">⌘S</span>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </Portal.Root>
                </form>

                <div className="my-6 h-px bg-border"></div>
                {/* <p className="heading mt-6">Ingredients</p> */}
                <div className="space-y-6 text-prose-body">
                    {data.ingredients && data.ingredients.length > 0 && (
                        <>
                            {data.ingredients.map((group, index) => (
                                <div key={index}>
                                    <p className="heading mb-4">{group.name || "Ingredients"}</p>
                                    <ul className="space-y-3">
                                        {group.items.map(({ item, quantity, unit }, index) => (
                                            <li key={index}>
                                                <label className="grid grid-cols-[100px_1fr] gap-1">
                                                    <div className="grid-col-span-1 justify-self-end text-right">
                                                        <input 
                                                            className="rounded-none border-transparent outline-none font-semibold tabular-nums"
                                                            value={quantity}
                                                            onChange={(e) => {
                                                                const newIngredients = [...data.ingredients];
                                                                newIngredients[index].items[index].quantity = e.target.value;
                                                                setData("ingredients", newIngredients);
                                                            }}
                                                            style={{ width: useDynamicInputWidthStyle(String(quantity), 2) }} 
                                                        />
                                                        {unit && (
                                                            <input 
                                                                className="rounded-none border-transparent outline-none font-semibold grid-col-span-1 justify-self-end text-right"
                                                                value={unit} 
                                                                onChange={(e) => {
                                                                    const newIngredients = [...data.ingredients];
                                                                    newIngredients[index].items[index].unit = e.target.value;
                                                                    setData("ingredients", newIngredients);
                                                                }}
                                                                style={{ width: useDynamicInputWidthStyle(String(unit)) }} 
                                                            />
                                                        )}
                                                    </div>
                                                    {item}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                    <input
                                        id="new_ingredient_group_name"
                                        name="new_ingredient_group_name"
                                        placeholder="New Ingredient Group"
                                        className="rounded-none border-transparent outline-none"
                                    />
                                    {/* <Button size="icon" variant="ghost" className="size-7 text-muted-foreground">
                                        <Plus aria-hidden="true" />
                                    </Button> */}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                
                <div className="my-6 h-px bg-border"></div>
                <p className="heading">Instructions</p>
                <Editor editor={editor} />
            </div>
        </AuthenticatedLayout>
    );
}
