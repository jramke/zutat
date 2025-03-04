import { Button } from '@/Components/ui/button';
import { FormField, FormFieldError, FormFieldLabel } from '@/Components/ui/form-field';
import { Input } from '@/Components/ui/input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-muted-foreground">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <FormField>
                    <FormFieldLabel>Email</FormFieldLabel>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)} 
                    />
                    {/* {errors.email && <FormFieldError>{errors.email}</FormFieldError>} */}
                    <FormFieldError error={errors.email} />
                </FormField>

                <div className="flex items-center justify-end">
                    <Button className="ms-4" disabled={processing}>
                        Email Password Reset Link
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
