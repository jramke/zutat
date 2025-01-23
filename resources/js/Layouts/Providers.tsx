import { scan } from "react-scan";
import { TooltipProvider } from "@/Components/ui/tooltip";
import React from "react";

export default function Providers({ children }: React.PropsWithChildren)  {
    // if (typeof window !== 'undefined') {
    //     scan({
    //         enabled: true,
    //         log: true, // logs render info to console (default: false)
    //     });
    // }

    return (
        <TooltipProvider>
            {children}
        </TooltipProvider>
    );
}