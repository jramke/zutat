import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui-components/react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
	({ className, children, ...props }, ref) => (
        <label className="group flex items-center gap-2 text-base">
            <CheckboxPrimitive.Root
                ref={ref}
                className={cn(
                    'flex size-5 items-center justify-center rounded-sm outline-hidden focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground data-[checked]:bg-foreground data-[unchecked]:border group-hover:border-secondary',
                    className
                )}
                {...props}
            >
                <CheckboxPrimitive.Indicator className={cn('flex text-gray-50 data-[unchecked]:hidden')}>
                    <Check className="size-4 text-background" />
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {children}
        </label>
	)
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
