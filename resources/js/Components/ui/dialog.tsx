import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui-components/react/dialog';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/Components/ui/button';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogBackdrop = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Backdrop>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Backdrop>>(
	({ className, ...props }, ref) => (
		<DialogPrimitive.Backdrop
			className={cn(
				'fixed inset-0 bg-black opacity-70 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
				className
			)}
			{...props}
			ref={ref}
		/>
	)
);
DialogBackdrop.displayName = DialogPrimitive.Backdrop.displayName;

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Popup>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Popup>>(
	({ className, ...props }, ref) => (
		<DialogPortal>
			<DialogBackdrop />
			<DialogPrimitive.Popup
				ref={ref}
				className={cn(
					'fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 outline outline-border transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
					className
				)}
				{...props}
			/>
		</DialogPortal>
	)
);
DialogContent.displayName = DialogPrimitive.Popup.displayName;

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex justify-end gap-4', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(
	({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn('-mt-1.5 mb-1 text-lg font-bold tracking-tight', className)} {...props} />
);
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn('mb-6 text-sm', className)} {...props} />);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogClose = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Close>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>>(
	({ className, ...props }, ref) => <DialogPrimitive.Close ref={ref} className={cn(buttonVariants(), className)} {...props} />
);
DialogClose.displayName = DialogPrimitive.Close.displayName;

export {
	Dialog,
	DialogPortal,
	DialogBackdrop,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogFooter,
	DialogDescription,
	DialogClose
};
