import ApplicationLogo from '@/Components/ApplicationLogo';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {    
    return (
        <main className="py-section content-grid justify-items-center">
            <div className="max-w-[350px] w-full">
                <div className="flex flex-wrap justify-between items-center mb-10">
                    <Link href="/">
                        <ApplicationLogo className="size-8" />
                    </Link>
                    <div className="flex text-sm gap-4">
                        <Link href="/login" className={cn("link font-normal no-underline p-0 text-muted-foreground", route().current("login") && "text-foreground underline")}>
                            Login
                        </Link>
                        <Link href="/register" className={cn("link font-normal no-underline p-0 text-muted-foreground", route().current("register") && "text-foreground underline")}>
                            Register
                        </Link>
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </main>
    );
}
