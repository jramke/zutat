import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, usePage } from "@inertiajs/react";
import { Fragment, PropsWithChildren, useContext } from "react";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import Providers from "./Providers";

function Breadcrumbs() {
    const breadcrumbs = usePage().props.breadcrumbs || [];

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
                    if (index === breadcrumbs.length - 1) {
                        return (
                            <li key={id}>
                                <span
                                    className="font-semibold "
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
                                    className="text-muted-foreground transition-all focus-visible:text-foreground hover:text-foreground"
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

export default function Authenticated({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;

    return (
        <Providers>
            <div className="min-h-screen">
                <nav className="content-grid py-8 sticky top-0">
                    <div className="full-width-fluid">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <Link href="/">
                                    <ApplicationLogo className="size-8" />
                                </Link>
                                <Breadcrumbs />
                            </div>
                            <div id="navbar-action" className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button
                                                variant={"ghost"}
                                                className="pe-2 ps-3.5"
                                            >
                                                {user.name || user.username}
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
                </nav>
                <main className="py-10">{children}</main>
            </div>
        </Providers>
    );
}
