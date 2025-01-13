import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'button',
	{
		variants: {
			variant: {
				default: 'button-default',
				destructive: 'button-destructive',
				secondary: 'button-secondary',
				ghost: 'button-ghost',
				link: 'text-primary underline-offset-4 hover:underline border-none'
			},
			size: {
				default: 'h-8 px-3 py-1.5',
				icon: 'size-8'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
	return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
