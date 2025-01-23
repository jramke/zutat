import * as React from "react"

import { Input as InputPrimitive } from '@base-ui-components/react/input';
import { cn } from "@/lib/utils"

const Input = React.forwardRef<React.ElementRef<typeof InputPrimitive>, React.ComponentPropsWithoutRef<typeof InputPrimitive>>(
    ({ className, ...props }, ref) => (
        <InputPrimitive
            className={cn(
                'h-10 w-full rounded-md border pl-3 text-base focus:outline-2 focus:-outline-offset-1 focus:outline-foreground',
                className
            )}
            {...props}
            ref={ref}
        />
    )
);
Input.displayName = InputPrimitive.displayName;

export { Input }
