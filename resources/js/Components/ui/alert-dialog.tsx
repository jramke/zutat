import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from '@base-ui-components/react/alert-dialog';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/Components/ui/button';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogBackdrop = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Backdrop>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Backdrop>>(
	({ className, ...props }, ref) => (
		<AlertDialogPrimitive.Backdrop
			className={cn(
				'fixed inset-0 bg-background/60 backdrop-blur-xl transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0',
				className
			)}
			{...props}
			ref={ref}
		/>
	)
);
AlertDialogBackdrop.displayName = AlertDialogPrimitive.Backdrop.displayName;

const AlertDialogContent = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Popup>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Popup>>(
	({ className, ...props }, ref) => (
		<AlertDialogPortal>
			<AlertDialogBackdrop />
			<AlertDialogPrimitive.Popup
				ref={ref}
				className={cn(
					'fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background p-6 outline outline-border transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
					className
				)}
				{...props}
			/>
		</AlertDialogPortal>
	)
);
AlertDialogContent.displayName = AlertDialogPrimitive.Popup.displayName;

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn('flex justify-end gap-4', className)} {...props} />
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>>(
	({ className, ...props }, ref) => <AlertDialogPrimitive.Title ref={ref} className={cn('-mt-1.5 mb-1 heading', className)} {...props} />
);
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => <AlertDialogPrimitive.Description ref={ref} className={cn('mb-6 text-sm', className)} {...props} />);
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogClose = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Close>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close>>(
	({ className, ...props }, ref) => <AlertDialogPrimitive.Close ref={ref} className={cn(buttonVariants(), className)} {...props} />
);
AlertDialogClose.displayName = AlertDialogPrimitive.Close.displayName;

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogBackdrop,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogFooter,
	AlertDialogDescription,
	AlertDialogClose
};
