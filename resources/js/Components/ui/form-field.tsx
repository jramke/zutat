import * as React from 'react';
import { Field as FieldPrimitive } from '@base-ui-components/react/field';
import { cn } from '@/lib/utils';

const FormField = React.forwardRef<React.ElementRef<typeof FieldPrimitive.Root>, React.ComponentPropsWithoutRef<typeof FieldPrimitive.Root>>(
	({ className, ...props }, ref) => (
		<FieldPrimitive.Root
			className={cn(
				'flex w-full flex-col items-start gap-1',
				className
			)}
			{...props}
			ref={ref}
		/>
	)
);
FormField.displayName = FieldPrimitive.Root.displayName;

const FormFieldLabel = React.forwardRef<React.ElementRef<typeof FieldPrimitive.Label>, React.ComponentPropsWithoutRef<typeof FieldPrimitive.Label>>(
	({ className, ...props }, ref) => (
		<FieldPrimitive.Label
			className={cn(
				'text-sm font-medium',
				className
			)}
			{...props}
			ref={ref}
		/>
	)
);
FormFieldLabel.displayName = FieldPrimitive.Label.displayName;

const FormFieldError = React.forwardRef<React.ElementRef<typeof FieldPrimitive.Error>, React.ComponentPropsWithoutRef<typeof FieldPrimitive.Error> & { error?: string }>(
	({ className, error, ...props }, ref) => (
		<>
			{error && (
				<FieldPrimitive.Error
					forceShow
					className={cn(
						'text-sm text-destructive',
						className
					)}
					{...props}
					ref={ref}
				>
					{error}
				</FieldPrimitive.Error>
			)}
		</>
	)
);
FormFieldError.displayName = FieldPrimitive.Error.displayName;

const FormFieldDescription = React.forwardRef<React.ElementRef<typeof FieldPrimitive.Description>, React.ComponentPropsWithoutRef<typeof FieldPrimitive.Description>>(
	({ className, ...props }, ref) => (
		<FieldPrimitive.Description
			className={cn(
				'text-sm text-secondary-foreground',
				className
			)}
			{...props}
			ref={ref}
		/>
	)
);
FormFieldDescription.displayName = FieldPrimitive.Description.displayName;

export { 
	FormField,
	FormFieldLabel,
	FormFieldError,
	FormFieldDescription
};
