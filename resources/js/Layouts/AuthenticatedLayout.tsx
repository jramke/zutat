import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, usePage } from "@inertiajs/react";
import { Fragment, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "@/Components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Providers from "./Providers";
import { useWindowSize } from "@/lib/hooks/useWindowSize";
import { Breadcrumb } from "@/types";
import { cn } from "@/lib/utils";

type BreadcrumbTypes = "small" | "medium" | "large";

const getBreadcrumbsWithoutHome = (breadcrumbs: Breadcrumb[] | undefined) => {
    if (!breadcrumbs) {
        return [];
    }
    return breadcrumbs.filter((crumb) => crumb.title !== "Home");
};

function Breadcrumbs({ type, breadcrumbs }: { type: BreadcrumbTypes, breadcrumbs: Breadcrumb[] | undefined }) {
    if (breadcrumbs?.length === 0 || !breadcrumbs) {
        return null;
    }

    if (type === "medium" || type === "small") {
        if (breadcrumbs.length < 2) {
            return null;
        }
        return (
            <Link 
                href={breadcrumbs[breadcrumbs.length - 2].url} 
                className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "relative -ml-2"
                )}
            >
                <ChevronLeft aria-hidden="true" />
                <div className="font-semibold text-base absolute top-[50%] translate-y-[-50%] left-full pl-1">
                    {type === "small" ? "Back" : breadcrumbs[breadcrumbs.length - 2].mobile}
                </div>
            </Link>
        );
    }

    if (type === "large") {
        breadcrumbs = getBreadcrumbsWithoutHome(breadcrumbs);
        if (breadcrumbs.length === 0) {
            return null;
        }
        return (
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 tracking-tight">
                    <li>
                        <ChevronRight
                            role="presentation"
                            aria-hidden="true"
                            className="size-4 text-muted-foreground -mb-[1px]"
                        />
                    </li>
                    {breadcrumbs.map((crumb, index) => {
                        const id = `breadcrumb-${index}`;
                        if (index === breadcrumbs!.length - 1) {
                            return (
                                <li key={id}>
                                    <span
                                        className="font-semibold truncate whitespace-nowrap"
                                        aria-current="page"
                                    >
                                        {crumb.title}
                                    </span>
                                </li>
                            );
                        }
                        return (
                            <Fragment key={id}>
                                <li>
                                    <Link
                                        href={crumb.url}
                                        className="text-muted-foreground transition-all focus-visible:text-foreground hover:text-foreground whitespace-nowrap"
                                    >
                                        {crumb.title}
                                    </Link>
                                </li>
                                <li>
                                    <ChevronRight
                                        role="presentation"
                                        aria-hidden="true"
                                        className="size-4 text-muted-foreground -mb-[1px]"
                                    />
                                </li>
                            </Fragment>
                        );
                    })}
                </ol>
            </nav>
        );
    }
}

export default function Authenticated({ children }: PropsWithChildren) {
    const pageProps = usePage().props;
    const user = pageProps.auth.user;
    const breadcrumbs = pageProps.breadcrumbs;    

    const { width } = useWindowSize();
    let type: BreadcrumbTypes = "small";

    if (width > 640) {
        type = "medium";
    }

    if (width > 980) {
        type = "large";
    }

    return (
        <Providers>
            <div className="min-h-screen">
                <nav className="content-grid py-8 sticky top-0 z-1 top-nav-bg-blur">
                    <div className="full-width-fluid">
                        <div className="flex justify-between gap-4">
                            <div className="flex items-center gap-2">
                                {(!breadcrumbs || getBreadcrumbsWithoutHome(breadcrumbs).length === 0 || type === "large") && (
                                    <Link href="/">
                                        <ApplicationLogo className="size-8" />
                                    </Link>
                                )}
                                <Breadcrumbs breadcrumbs={breadcrumbs} type={type} />
                            </div>
                            <div id="navbar-action" className="flex items-center gap-2 shrink-0">
                                <div className="hidden only:block">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="secondary"
                                                    className="pe-1.5"
                                                >
                                                    {user.name}
                                                    <ChevronDown aria-hidden="true" />
                                                </Button>
                                            }
                                        />
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                render={
                                                    <Link href={route("profile.edit")}>
                                                        Profile
                                                    </Link>
                                                }
                                            />
                                            <DropdownMenuItem
                                                render={
                                                    <Link href="/home">Homepage</Link>
                                                }
                                            />
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                render={
                                                    <Link
                                                        href={route("logout")}
                                                        method="post"
                                                        as="button"
                                                        className="w-full"
                                                    >
                                                        Log Out
                                                    </Link>
                                                }
                                            />
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <main className="py-4 md:py-10">{children}</main>
            </div>
        </Providers>
    );
}
