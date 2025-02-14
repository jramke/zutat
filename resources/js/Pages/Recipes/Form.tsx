import { LoadingButton } from "@/Components/LoadingButton";
import {
    FormField,
    FormFieldError,
    FormFieldLabel,
} from "@/Components/ui/form-field";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Cookbook, IngredientGroup, PageProps, Recipe } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { useEditor, Editor } from "@/Components/Editor";
import * as Portal from "@radix-ui/react-portal";
import { useNavbarAction } from "@/lib/hooks/useNavbarAction";
import { Lock, LockOpen } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Toggle } from '@base-ui-components/react/toggle';
import Ingredients from "./Partials/Ingredients";
import Metadata from "./Partials/Metadata";
import { Separator } from "@/Components/ui/separator";
import useWakeLock from "@/lib/hooks/useWakeLock";

export default function Create({
    cookbook,
    recipe,
}: PageProps<{ cookbook: Cookbook, recipe: Recipe|null }>) {
    const isEditing = !!recipe;
    const titleInputRef = useRef<HTMLTextAreaElement|null>(null);
    const navbarActionEl = useNavbarAction();
    const formRef = useRef<HTMLFormElement|null>(null);

    const { release, request } = useWakeLock();

    // TODO: handle error messages from automatic recipe creation with usePage().props.errors

    let initialIngredients = recipe?.ingredients ?? [];
    if (initialIngredients.length === 0) {
        initialIngredients = [{ name: "Ingredients", items: [] }];
    }

    const form = useForm({
        title: recipe?.title ?? "",
        description: recipe?.description ?? "",
        instructions: recipe?.instructions ?? null,
        ingredients: JSON.stringify(initialIngredients ?? []),
        nutrition_per_serving: JSON.stringify(recipe?.nutrition_per_serving ?? null),
        difficulty: recipe?.difficulty ?? null,
        prep_time: recipe?.prep_time ?? "",
        cook_time: recipe?.cook_time ?? "",
        servings: recipe?.servings ?? 1,
        scaled_servings: recipe?.servings ?? 1,
        is_locked: recipe?.is_locked ?? false,
    });
    const { data, setData, post, patch,  processing, errors, clearErrors } = form;

    const editor = useEditor({ 
        content: data.instructions, 
        cookbook, 
        locked: data.is_locked, 
        onUpdate: ({ editor }) => setData("instructions", editor.getHTML() || null), 
    }, [data.is_locked]);

    if (!editor) {
        return null;
    }

    useEffect(() => {
        const abortController = new AbortController();
        
        if (!data.title) {
            titleInputRef.current?.focus();
        }

        window.addEventListener("keydown", (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                submit();
            }
        });

        if (data.is_locked) {
            request();
        } else {
            release();
        }

        return () => {
            abortController.abort();
            release();
        };
    }, []);

    function submit() {
        formRef.current?.requestSubmit();
    }

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const method = isEditing ? patch : post;
        const routeName = isEditing ? "recipes.update" : "recipes.store";

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

    

    return (
        <AuthenticatedLayout>
            <Head title={recipe?.title || "New Recipe"} />
            <div className="content-grid">
                <form ref={formRef} onSubmit={onSubmit} className="not-prose space-y-6" id="recipe-editor-form">
                    <FormField>
                        <FormFieldLabel className="sr-only">Title</FormFieldLabel>
                        <textarea
                            ref={titleInputRef}
                            id="title"
                            name="title"
                            placeholder="New Recipe"
                            className="w-full heading rounded-none border-transparent outline-none textarea-autosize"
                            style={{ "--min-height": "1lh" } as React.CSSProperties}
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            required
                            readOnly={data.is_locked}
                        />
                        <FormFieldError error={errors.title} />
                    </FormField>

                    <Metadata form={form} />

                    {/* TODO: replace with base-ui portal if released */}
                    <Portal.Root container={navbarActionEl}>
                        <div className="flex gap-2">
                            {isEditing && (
                                <Toggle 
                                    pressed={data.is_locked}
                                    onPressedChange={(isLocked) => {
                                        setData("is_locked", isLocked);
                                        if (isLocked) {
                                            request();
                                            setTimeout(() => {
                                                submit();
                                            }, 0);
                                        } else {
                                            release();
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

                <Separator className="my-6" />
                {/* <p className="heading mt-6">Ingredients</p> */}
                <div className="space-y-6 text-prose-body">
                    <Ingredients ingredients={JSON.parse(data.ingredients)} form={form} />
                </div>
                
                <Separator className="my-6" />
                <p className="heading">Instructions</p>
                <Editor editor={editor} />
            </div>
        </AuthenticatedLayout>
    );
}