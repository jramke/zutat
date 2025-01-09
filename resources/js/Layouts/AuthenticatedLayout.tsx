import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";
import { Button } from "@/Components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Authenticated({ children }: PropsWithChildren) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen">
            <nav className="content-grid py-8 sticky top-0">
                <div className="flex justify-between breakout-lg">
                    <Link href="/">
                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button variant={"ghost"}>
                                    {user.name || user.username}
                                    <ChevronDown aria-hidden="true" />
                                </Button>
                            }
                        />
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                render={
                                    <Link href={route("profile.edit")}>
                                        Profile
                                    </Link>
                                }
                            />
                            <DropdownMenuItem
                                render={<Link href="/home">Homepage</Link>}
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
            </nav>
            <main className="py-20">{children}</main>
        </div>
    );
}
