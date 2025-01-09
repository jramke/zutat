import { cn } from "@/lib/utils";
import { InertiaLinkProps, Link } from "@inertiajs/react";
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from "react";

export function Bookshelf({
    children,
    center,
}: PropsWithChildren<{ center?: boolean }>) {
    return (
        <div className="bookshelf not-prose breakout">
            <div
                className={cn(
                    "bookshelf-item-wrapper",
                    center && "grid-cols-1 justify-items-center"
                )}
            >
                {children}
            </div>
        </div>
    );
}

export function Book({
    children,
    className,
    ...props
}: PropsWithChildren<InertiaLinkProps>) {
    return (
        <Link {...props} className="book h-full w-[130px]">
            <div className="book-inside"></div>
            <div className="book-cover">{children}</div>
        </Link>
    );
}

export const BookPlaceholder = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "cursor-pointer",
                "h-full w-[130px] block p-3",
                "grid place-items-center text-center rounded-2xl backdrop-blur-xs bg-[#e7e7e718]",
                className
            )}
            {...props}
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23C1C1C1FF' stroke-width='5' stroke-dasharray='6%2c 17' stroke-dashoffset='25' stroke-linecap='square'/%3e%3c/svg%3e")`,
            }}
        />
    );
});
BookPlaceholder.displayName = "BookPlaceholder";
