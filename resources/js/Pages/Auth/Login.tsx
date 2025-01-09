import { Checkbox } from '@/Components/ui/checkbox';
import { Button, buttonVariants } from '@/Components/ui/button';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { FormField, FormFieldError, FormFieldLabel } from '@/Components/ui/form-field';
import { Input } from '@/Components/ui/input';
import { LoadingButton } from '@/Components/LoadingButton';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        // email: '',
        password: '',
        remember: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-success">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <FormField>
                    <FormFieldLabel>Username</FormFieldLabel>
                    <Input 
                        id="username"
                        name="username"
                        value={data.username}
                        autoFocus
                        autoComplete='username'
                        onChange={(e) => setData('username', e.target.value)}
                    />
                    {/* {errors.username && <FormFieldError>{errors.username}</FormFieldError>} */}
                    <FormFieldError error={errors.username} />
                </FormField>

                <FormField>
                    <FormFieldLabel>Password</FormFieldLabel>
                    <Input 
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {/* {errors.password && <FormFieldError>{errors.password}</FormFieldError>} */}
                    <FormFieldError error={errors.password} />
                </FormField>

                <FormField className="hidden">
                    <Checkbox 
                        name="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) =>
                            setData('remember', checked)
                        }
                    >
                        Remember me
                    </Checkbox>
                </FormField>

                <div className="flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className={buttonVariants({ variant: 'link' })}>
                            Forgot your password?
                        </Link>
                    )}
                    <LoadingButton className="ms-4" loading={processing}>
                        Log in
                    </LoadingButton>
                </div>
            </form>
        </GuestLayout>
    );
}
