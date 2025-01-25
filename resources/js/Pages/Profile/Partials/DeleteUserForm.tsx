import { AlertDialog, AlertDialogClose, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Button, buttonVariants } from '@/Components/ui/button';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { FormField, FormFieldError, FormFieldLabel } from '@/Components/ui/form-field';
import { Input } from '@/Components/ui/input';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const resetModal = () => {
        reset();
        clearErrors();
    };

    const openChange = (open: boolean) => {
        setOpen(open);
        resetModal();
    };

    const deleteUser: FormEventHandler = (e) => {        
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onError: () => passwordInput.current?.focus(),
            onSuccess: () => { 
                setOpen(false);
                resetModal();
            },
        });
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="heading">
                    Delete Account
                </h2>

                <p className="mt-1 text-sm text-prose-body">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <AlertDialog open={open} onOpenChange={openChange}>
                <AlertDialogTrigger render={
                    <Button variant="destructive">
                        Delete Account
                    </Button>
                } />
                <AlertDialogContent>
                    <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </AlertDialogDescription>
                    <form onSubmit={deleteUser}>
                        <FormField>
                            <FormFieldLabel>Password</FormFieldLabel>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                autoFocus
                                placeholder="Password"
                            />
                            {/* {errors.password && (<FormFieldError>{errors.password}</FormFieldError>)} */}
                            <FormFieldError error={errors.password} />
                        </FormField>
                        <AlertDialogFooter className="mt-6">
                            <AlertDialogClose>Cancel</AlertDialogClose>
                            <Button 
                                type="submit"
                                className={buttonVariants({ variant: 'destructive' })} 
                                disabled={processing}
                            >
                                Delete Account
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
}
