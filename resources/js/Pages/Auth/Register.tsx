import { Button, buttonVariants } from '@/Components/ui/button';
import { FormField, FormFieldError, FormFieldLabel } from '@/Components/ui/form-field';
import { Input } from '@/Components/ui/input';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
	const { data, setData, post, processing, errors, reset } = useForm({
		// name: '',
		username: '',
		email: '',
		password: '',
		password_confirmation: ''
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route('register'), {
			onFinish: () => reset('password', 'password_confirmation')
		});
	};

	return (
		<GuestLayout>
			<Head title="Register" />

			<form onSubmit={submit} className="space-y-4">
				{/* <FormField>
					<FormFieldLabel>Display Name</FormFieldLabel>
					<Input id="name" name="name" value={data.name} autoComplete="name" autoFocus onChange={(e) => setData('name', e.target.value)} required />
					{errors.name && <FormFieldError>{errors.name}</FormFieldError>}
				</FormField> */}

				<FormField>
					<FormFieldLabel>Username</FormFieldLabel>
					<Input id="username" name="username" value={data.username} autoFocus autoComplete="username" onChange={(e) => setData('username', e.target.value)} required />
					{/* {errors.username && <FormFieldError>{errors.username}</FormFieldError>} */}
					<FormFieldError error={errors.username} />
				</FormField>

				<FormField>
					<FormFieldLabel>Email</FormFieldLabel>
					<Input id="email" type="email" name="email" value={data.email} autoComplete="username" onChange={(e) => setData('email', e.target.value)} required />
					{/* {errors.email && <FormFieldError>{errors.email}</FormFieldError>} */}
					<FormFieldError error={errors.email} />
				</FormField>

				<FormField>
					<FormFieldLabel>Pasword</FormFieldLabel>
					<Input
						id="password"
						type="password"
						name="password"
						value={data.password}
						className="mt-1 block w-full"
						autoComplete="new-password"
						onChange={(e) => setData('password', e.target.value)}
						required
					/>
					{/* {errors.password && <FormFieldError>{errors.password}</FormFieldError>} */}
					<FormFieldError error={errors.password} />
				</FormField>

				<FormField>
					<FormFieldLabel>Confirm Password</FormFieldLabel>
					<Input
						id="password_confirmation"
						type="password"
						name="password_confirmation"
						value={data.password_confirmation}
						className="mt-1 block w-full"
						autoComplete="new-password"
						onChange={(e) => setData('password_confirmation', e.target.value)}
						required
					/>
					{/* {errors.password_confirmation && <FormFieldError>{errors.password_confirmation}</FormFieldError>} */}
					<FormFieldError error={errors.password_confirmation} />
				</FormField>

				<div className="mt-4 flex items-center justify-end">
					<Link
						href={route('login')}
						className={buttonVariants({ variant: 'link'})}
					>
						Already registered?
					</Link>

					<Button className="ms-4" disabled={processing}>
						Register
					</Button>
				</div>
			</form>
		</GuestLayout>
	);
}
