import { Button } from '@/Components/ui/button';
import { FormField, FormFieldError, FormFieldLabel } from '@/Components/ui/form-field';
import { Input } from '@/Components/ui/input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
	const { data, setData, post, processing, errors, reset } = useForm({
		password: ''
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route('password.confirm'), {
			onFinish: () => reset('password')
		});
	};

	return (
		<GuestLayout>
			<Head title="Confirm Password" />

			<div className="mb-4 text-sm text-gray-600">This is a secure area of the application. Please confirm your password before continuing.</div>

			<form onSubmit={submit} className="space-y-4">
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

				<div className="mt-4 flex items-center justify-end">
					<Button className="ms-4" disabled={processing}>
						Confirm
					</Button>
				</div>
			</form>
		</GuestLayout>
	);
}
