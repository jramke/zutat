import { Button } from "@/Components/ui/button";
import { FormField, FormFieldDescription, FormFieldError, FormFieldLabel } from "@/Components/ui/form-field";
import { Input } from "@/Components/ui/input";
import { Cookbook, TODO } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";

export default function CreateRecipeFromUrlForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const cookbook = usePage().props.cookbook;

    const { data, setData, errors, processing, post, clearErrors, recentlySuccessful } = useForm({
        url: "",
    });

    const submit = () => {
        formRef.current?.requestSubmit();
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("recipes.from-url", { cookbook }), {
            preserveScroll: true,
            preserveState: 'errors',
            onBefore: (e) => {},
            onError: (e) => {},
            onSuccess: (e) => {
                clearErrors();
            },
        });
    };

    return (
        <form ref={formRef} onSubmit={onSubmit} className="not-prose">
            <FormField>
                <FormFieldLabel>URL</FormFieldLabel>
                <Input 
                    name="url" 
                    type="url" 
                    value={data.url}
                    onChange={(e) => setData("url", e.currentTarget.value)}
                    disabled={processing}
                    onPaste={() => {
                        setTimeout(() => {
                            submit();
                        }, 0);
                    }}
                />
                <FormFieldDescription>Paste any URL to generate a recipe from it</FormFieldDescription>
                <FormFieldError error={errors.url} />
            </FormField>
            <Button type="submit" disabled={processing}>Create</Button>
        </form>
    );
}