import { PropsWithChildren } from 'react';

export default function Landing({ children }: PropsWithChildren) {
    return (
        <>
            <main className="py-section [&>*]:last:mb-0 [&>*]:first:mt-0">
                {children}
            </main>
            <footer className="pb-10 text-center text-sm text-muted-foreground">
                Made by <a className="link font-normal text-sm transition-colors hover:text-foreground focus-visible:text-foreground"  href="https://joostramke.com" target="_blank">Joost</a>
            </footer>
        </>
    );
}
