import { PropsWithChildren } from "react";
import Providers from "./Providers";

export default function Landing({ children }: PropsWithChildren) {
    return (
        <Providers>
            <main className="py-section [&>*]:last:mb-0 [&>*]:first:mt-0">
                {children}
            </main>
            <footer className="content-grid pb-10">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()}
                    </p>
                    <p>
                        Made by{" "}
                        <a
                            className="link font-normal text-sm transition-colors hover:text-foreground focus-visible:text-foreground"
                            href="https://joostramke.com"
                            target="_blank"
                        >
                            Joost
                        </a>
                    </p>
                </div>
            </footer>
        </Providers>
    );
}
