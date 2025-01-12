import { TooltipProvider } from "@/Components/ui/tooltip";
import { PropsWithChildren } from "react";

export default function Providers({ children }: PropsWithChildren)  {
    return (
        <TooltipProvider>
            {children}
        </TooltipProvider>
    );
}