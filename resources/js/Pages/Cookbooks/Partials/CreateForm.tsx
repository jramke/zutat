import { BookPlaceholder } from "@/Components/Bookshelf";
import { LoadingButton } from "@/Components/LoadingButton";
import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    FormField,
    FormFieldLabel,
    FormFieldError,
} from "@/Components/ui/form-field";
import { Input } from "@/Components/ui/input";
import { useForm, usePage } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { FormEventHandler, useState } from "react";

export default function CreateCookbookForm() {
    const user = usePage().props.auth.user;

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: "",
        description: "",
    });

    const resetModal = () => {
        reset();
        clearErrors();
    };

    const openChange = (open: boolean) => {
        setOpen(open);
        resetModal();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("cookbooks.store", { user }), {
            preserveScroll: true,
            onSuccess: () => { 
                setOpen(false);
                resetModal();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogTrigger
                render={
                    <BookPlaceholder key="create-new">
                        <span className="sr-only">New cookbook</span>
                        <Plus aria-hidden={true} className="size-7 text-muted-foreground" />
                    </BookPlaceholder>
                }
            />
            <DialogContent>
                <DialogTitle>New Cookbook</DialogTitle>
                <DialogDescription>
                    Create a new cookbook to organize your recipes.
                </DialogDescription>
                <form onSubmit={submit} className="space-y-6">
                    <FormField>
                        <FormFieldLabel>Title</FormFieldLabel>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            required
                        />
                        <FormFieldError error={errors.title} />
                    </FormField>
                    <FormField>
                        <FormFieldLabel>Description</FormFieldLabel>
                        <Input
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                        <FormFieldError error={errors.description} />
                    </FormField>
                    <DialogFooter>
                        <LoadingButton loading={processing} >Create Cookbook</LoadingButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
