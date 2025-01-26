import { Button } from '@/Components/ui/button';
import { FormField, FormFieldError, FormFieldLabel } from '@/Components/ui/form-field';
import { Input } from '@/Components/ui/input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Form } from '@base-ui-components/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit} className="space-y-4">
                <FormField>
                    <FormFieldLabel>Email</FormFieldLabel>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <FormFieldError error={errors.email} />
                </FormField>

                <FormField>
                    <FormFieldLabel>Password</FormFieldLabel>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full"
                        autoComplete="new-password"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <FormFieldError error={errors.password} />
                </FormField>

                <FormField>
                    <FormFieldLabel>Password Confirmation</FormFieldLabel>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />
                    <FormFieldError error={errors.password_confirmation} />
                </FormField>

                <div className="mt-4 flex items-center justify-end">
                    <Button className="ms-4" disabled={processing}>
                        Reset Password
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
