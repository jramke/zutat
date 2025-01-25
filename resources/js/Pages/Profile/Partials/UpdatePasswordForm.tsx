import { Button } from "@/Components/ui/button";
import {
    FormField,
    FormFieldError,
    FormFieldLabel,
} from "@/Components/ui/form-field";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef } from "react";

export default function UpdatePasswordForm({
    className = "",
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="heading">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-prose-body">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <FormField>
                    <FormFieldLabel>Current Password</FormFieldLabel>
                    <Input
                        id="current_password"
                        value={data.current_password}
                        ref={currentPasswordInput}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        required
                        autoComplete="current-password"
                    />
                    {/* {errors.current_password && (
                        <FormFieldError>
                            {errors.current_password}
                        </FormFieldError>
                    )} */}
                    <FormFieldError error={errors.current_password} />
                </FormField>

                <FormField>
                    <FormFieldLabel>New Password</FormFieldLabel>
                    <Input
                        id="password"
                        value={data.password}
                        ref={passwordInput}
                        onChange={(e) => setData("password", e.target.value)}
                        required
                        type="password"
                        autoComplete="new-password"
                    />
                    {/* {errors.password && (<FormFieldError>{errors.password}</FormFieldError>)} */}
                    <FormFieldError error={errors.password} />
                </FormField>
                    
                <FormField>
                    <FormFieldLabel>Confirm Password</FormFieldLabel>
                    <Input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        required
                        autoComplete="new-password"
                    />
                    {/* {errors.password_confirmation && (<FormFieldError>{errors.password_confirmation}</FormFieldError>)} */}
                    <FormFieldError error={errors.password_confirmation} />
                </FormField>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save</Button>
                    
                    {recentlySuccessful && (
                        <p className="text-sm text-success">Saved.</p>
                    )}
                </div>
            </form>
        </section>
    );
}
