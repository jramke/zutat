import ApplicationLogo from "@/Components/ApplicationLogo";
import { BookPlaceholder, Bookshelf } from "@/Components/Bookshelf";
import { LoadingButton } from "@/Components/LoadingButton";
import { Button } from "@/Components/ui/button";
import LandingLayout from "@/Layouts/LandingLayout";
import { PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";

export default function Landing({
    canLogin,
    canRegister,
}: PageProps<{ canLogin: boolean; canRegister: boolean }>) {
    const user = usePage().props.auth.user;

    return (
        <LandingLayout>
            <Head title="Home" />

            {user?.email_verified_at === null && (
                <div className="content-grid mb-section">
                    <div
                        className=" bg-orange-200 border rounded border-orange-300 text-orange-900 p-4"
                        role="alert"
                    >
                        <p className="font-bold">
                            Please verify your email address
                        </p>
                        <p>
                            You must verify your email address before you can
                            access your account.
                        </p>
                        <p>
                            Or click{" "}
                            <Link href="/profile" className="link">
                                here
                            </Link>{" "}
                            to edit your profile.
                        </p>
                    </div>
                </div>
            )}

            <section className="my-section content-grid">
                <div className="mb-7 flex justify-between items-center">
                    <Link href="/">
                        <ApplicationLogo aria-hidden={true} className="size-8" /> 
                    </Link>
                    <Link href="/login" className="link font-normal text-sm transition-colors hover:text-foreground focus-visible:text-foreground">
                        Login
                    </Link>
                </div>
                <div className="prose [&>p]:text-justify [&>p]:tracking-[-0.1px]">
                    <h1>
                        Back to the essence of cooking.
                        {/* <span>
                            <ApplicationLogo aria-hidden={true} className="inline-block size-6 ms-1 me-1 translate-y-[-3px]" />    
                        </span> */}
                    </h1>
                    <p>
                        Recipe collections always where a pain. Either its big
                        cookbooks taking up space in your kitchen, an app with
                        complex 10 year old interfaces, or selfmade templates in
                        Obsidian or Notion.
                    </p>
                    <p>
                        Zutat brings back the joy of simple recipe collections.
                        An modern intuitive interface, with only the features
                        you need. Recepices are stored in markdown format on
                        your device so no need to worry about your data.
                    </p>
                    <p>
                        I think you've probably already saved a recipe on tiktok
                        or instagram. If you've ever wanted to make such recipe,
                        you've probably realised that cooking a dish according
                        to a recipe on a looping video on your phone and a tiny
                        description is a real pain.
                    </p>
                    <p>
                        Your digital cookbook, without the noise. Because
                        cooking should be about the food.
                    </p>
                    {/* {user && (
                        <p>
                            <Link href="/" className="link">
                                Back to your digital kitchen shelfd
                            </Link>
                        </p>
                    )} */}
                </div>
            </section>

            <section className="my-section content-grid prose">
                <Bookshelf center={true}>
                    <BookPlaceholder onClick={() => router.get("/register")}>
                        <span className="text-sm font-bold">
                            Create your first cookbook
                        </span>
                    </BookPlaceholder>
                </Bookshelf>
            </section>
        </LandingLayout>
    );
}
