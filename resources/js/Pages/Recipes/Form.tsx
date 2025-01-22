import { LoadingButton } from "@/Components/LoadingButton";
import {
    FormField,
    FormFieldError,
    FormFieldLabel,
} from "@/Components/ui/form-field";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Cookbook, PageProps, Recipe } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, ReactNode, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { useEditor, Editor } from "@/Components/Editor";
import * as Portal from "@radix-ui/react-portal";
import { useNavbarAction } from "@/lib/hooks/useNavbarAction";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select";
import { CircleDashed, DollarSign, Pentagon, Square, Triangle } from "lucide-react";

export default function Create({
    cookbook,
    recipe,
}: PageProps<{ cookbook: Cookbook, recipe: Recipe|null }>) {
    const isEditing = !!recipe;
    const titleInputRef = useRef<HTMLInputElement|null>(null);
    const navbarActionEl = useNavbarAction();
    const formRef = useRef<HTMLFormElement|null>(null);

    // console.log(recipe);
    // console.log(usePage().props);
    const recipeDifficultyOptions = usePage().props.enums.recipeDifficulty.map((option) => ({
        ...option,
        icon: {
            "easy": <Triangle className="size-4 text-success/70" aria-hidden="true" />,
            "medium": <Square className="size-4 text-orange-300" aria-hidden="true" />,
            "hard": <Pentagon className="size-4 text-destructive/70" aria-hidden="true" />,
        }[option.value],
    }));

    const { data, setData, post, patch,  processing, errors, reset, clearErrors, transform } = useForm({
        title: recipe?.title ?? "",
        description: recipe?.description ?? "",
        instructions: recipe?.instructions ?? null,
        ingredients: recipe?.ingredients ?? null,
        cuisine_type: recipe?.cuisine_type ?? "",
        difficulty: recipe?.difficulty ?? null,
        prep_time: recipe?.prep_time ?? null,
        cook_time: recipe?.cook_time ?? null,
        servings: recipe?.servings ?? null,
    });    

    const editor = useEditor({ content: data.instructions, cookbook });

    if (!editor) {
        return null;
    }

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

        transform((data) => {
            return {
                ...data,
                instructions: editor?.getHTML() || null,
            };
        });

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

    const metadataFields: Array<{name: keyof typeof data, label: string, control: ReactNode}> = [
        { 
            name: "description", 
            label: "Description",
            control: 
                <textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the recipe"
                    className="w-full rounded-none border-transparent outline-none flex textarea-autosize text-prose-body"
                    style={{ "--min-height": "2lh" } as React.CSSProperties}
                    value={data.description}
                    onChange={(e) => {setData("description", e.target.value)}}
                />
        },
        { 
            name: "difficulty", 
            label: "Difficulty",
            control: 
                <Select value={data.difficulty} onValueChange={(value) => setData("difficulty", value as string)}>
                    <SelectTrigger className="h-auto justify-start gap-2 text-prose-body p-0 border-transparent outline-none !bg-transparent [&_svg[data-select-icon]]:hidden">
                        {recipeDifficultyOptions.find(option => option.value === data.difficulty)?.icon || <CircleDashed className="size-4 text-placeholder" aria-hidden="true" />}
                        {recipeDifficultyOptions.find(option => option.value === data.difficulty)?.name || <span className="text-placeholder">Choose Difficulty</span>}
                    </SelectTrigger>
                    <SelectContent className="w-[200px]">
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
        },
        {
            name: "cuisine_type",
            label: "Cuisine Type",
            control: 
                <input
                    id="cuisine_type"
                    name="cuisine_type"
                    placeholder="Cuisine Type"
                    className="w-full rounded-none border-transparent outline-none text-prose-body"
                    value={data.cuisine_type}
                    onChange={(e) => setData("cuisine_type", e.target.value)}
                />
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
                        />
                        <FormFieldError error={errors.title} />
                    </FormField>

                    {metadataFields.map((field) => (
                        <FormField className="grid gap-6 grid-cols-4" key={field.name}>
                            <label htmlFor={field.name} className="col-span-1 text-muted-foreground font-semibold text-sm/6">{field.label}</label>
                            <div className={cn(
                                "col-span-3 relative isolate",
                                "after:-inset-x-2 after:-inset-y-1.5 after:absolute after:z-[-1] after:rounded after:transition-[background] after:ring-offset-background",
                                "hover:after:bg-muted focus-within:after:bg-muted",
                                // "focus-within:after:ring-2 focus-within:after:ring-ring focus-within:after:ring-offset-2"
                            )}>
                                {field.control}
                                <FormFieldError error={errors[field.name]} />
                            </div>
                        </FormField>
                    ))}

                    {/* TODO: replace with base-ui portal if released */}
                    <Portal.Root container={navbarActionEl}>
                        <Tooltip>
                            <TooltipTrigger render={
                                <LoadingButton form="recipe-editor-form" loading={processing}>{isEditing ? "Save" : "Create"}</LoadingButton>
                            } />
                            <TooltipContent>
                                <span className="text-muted-foreground text-xs">⌘S</span>
                            </TooltipContent>
                        </Tooltip>
                    </Portal.Root>
                </form>

                {data.ingredients && data.ingredients.length > 0 && (
                    <>
                        <div className="my-6 h-px bg-border"></div>
                        {/* <p className="heading mt-6">Ingredients</p> */}
                        <div className="space-y-6 prose">
                            {data.ingredients.map((group, index) => (
                                <div key={index}>
                                    <span className="heading">{group.name || "Ingredients"}</span>
                                    <ul>
                                        {group.items.map(({ item, quantity, unit }, index) => (
                                            <li key={index}>
                                                {quantity} {unit} {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                
                <div className="my-6 h-px bg-border"></div>
                <p className="heading">Instructions</p>
                <Editor editor={editor} />
            </div>
        </AuthenticatedLayout>
    );
}
