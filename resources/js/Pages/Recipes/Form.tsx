import { LoadingButton } from "@/Components/LoadingButton";
import {
    FormField,
    FormFieldError,
    FormFieldLabel,
} from "@/Components/ui/form-field";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Cookbook, PageProps, Recipe } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler, useContext, useEffect, useRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { useEditor, Editor } from "@/Components/Editor";
import * as Portal from "@radix-ui/react-portal";
import { useNavbarAction } from "@/lib/hooks/useNavbarAction";

export default function Create({
    cookbook,
    recipe,
}: PageProps<{ cookbook: Cookbook, recipe: Recipe|null }>) {
    const isEditing = !!recipe;
    const titleInputRef = useRef<HTMLInputElement|null>(null);
    const navbarActionEl = useNavbarAction();
    
    const { data, setData, post, patch,  processing, errors, reset, clearErrors, transform } = useForm({
        title: recipe?.title ?? "",
        description: recipe?.description ?? "",
        content: recipe?.content ?? null,
    });

    const editor = useEditor({ content: data.content });

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
                submit(e as any);
            }
        });

        return () => {
            abortController.abort();
        };
    }, []);


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const method = isEditing ? patch : post;
        const routeName = isEditing ? "recipes.update" : "recipes.store";

        transform((data) => {
            return {
                ...data,
                content: editor?.getJSON() || null,
            };
        });

        method(route(routeName, { cookbook, recipe }), {
            preserveScroll: true,
            onError: (e) => {
                console.log(e);
            },
            onSuccess: () => {
                // reset();
                clearErrors();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={recipe?.title || "New Recipe"} />
            <div className="content-grid">

                <form onSubmit={submit} className="not-prose" id="recipe-editor-form">
                    <FormField>
                        <FormFieldLabel className="sr-only">Title</FormFieldLabel>
                        <input
                            ref={titleInputRef}
                            id="title"
                            name="title"
                            placeholder="New Recipe"
                            className="heading rounded-none border-transparent outline-none"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            required
                        />
                        <FormFieldError error={errors.title} />
                    </FormField>
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

                <Editor editor={editor} />
            </div>
        </AuthenticatedLayout>
    );
}
