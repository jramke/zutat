import { forwardRef } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

export interface LoadingButtonProps extends ButtonProps {
    loading: boolean;
    loadingText?: string;
};

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(({ className, loading, children, disabled, loadingText, ...props }, ref) => {
    const isDisabled = disabled || loading;
    return (
        <Button
            ref={ref}
            {...props}
            type="submit"
            disabled={isDisabled}
            aria-label={loading ? (loadingText || "Loading...") : undefined}
            aria-busy={loading}
            className="grid place-items-center grid-cols-1 grid-rows-1 [&>*]:col-span-full [&>*]:row-span-full"
        >
            <AnimatePresence initial={false}>
                {loading && (
                    <motion.span 
                        transition={{ type: "spring", duration: 0.25, bounce: 0.3 }}
                        initial={{ opacity: 0, y: -25 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 25 }}
                    >
                        <Loader2 className="animate-spin" aria-hidden={true} />
                    </motion.span>
                )}
            </AnimatePresence>
            <motion.span 
                transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                animate= {{ opacity: loading ? 0 : 1, y: loading ? 30 : 0, scale: loading ? 0.8 : 1 }}
            >
                {children}
            </motion.span>
        </Button>
    );
});
LoadingButton.displayName = 'LoadingButton';
