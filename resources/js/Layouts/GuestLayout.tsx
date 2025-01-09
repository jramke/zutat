import ApplicationLogo from '@/Components/ApplicationLogo';
import { buttonVariants } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <main className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-foreground" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden p-6 rounded-lg border bg-card text-card-foreground sm:max-w-md">
                {children}
            </div>
            <div className="flex flex-wrap text-sm mt-4">
                <Link href="/login" className={buttonVariants({ variant: 'link' })}>
                    Login
                </Link>
                <Link href="/register" className={buttonVariants({ variant: 'link' })}>
                    Create Account
                </Link>
            </div>
        </main>
    );
}
