import { Book, Bookshelf, BookPlaceholder } from "@/Components/Bookshelf";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Cookbook, PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import CreateCookbookForm from "./Partials/CreateForm";
import { useState } from "react";
import { useWindowSize } from "@/lib/hooks/useWindowSize";

export default function Edit({
    cookbooks,
    auth,
}: PageProps<{ cookbooks: Cookbook[] }>) {
    const { width } = useWindowSize();

    let chunkSize = 1;
    if (width > 465) {
        chunkSize = 2;
    }
    if (width > 700) {
        chunkSize = 3;
    }
    if (width > 1080) {
        chunkSize = 4;
    }

    const cookbooksWithPlaceholder = [null, ...cookbooks];

    const chunkedCookbooks = cookbooksWithPlaceholder.reduce(
        (resultArr: (typeof cookbooksWithPlaceholder)[], item, index) => {
            const chunkIndex = Math.floor(index / chunkSize);

            if (!resultArr[chunkIndex]) {
                resultArr[chunkIndex] = [];
            }

            resultArr[chunkIndex].push(item);

            return resultArr;
        },
        []
    );

    return (
        <AuthenticatedLayout>
            <Head title="Cookbooks" />

            <section className="content-grid prose">
                {cookbooks?.length > 0 ? (
                    <>
                        {chunkedCookbooks.map((cookbooks, index) => (
                            <Bookshelf key={index} columns={chunkSize}>
                                {cookbooks.map((cookbook) => {
                                    if (cookbook === null) {
                                        return (
                                            <CreateCookbookForm key="create-new" />
                                        );
                                    }
                                    return (
                                        <Book
                                            key={cookbook.id}
                                            href={route("cookbooks.show", {
                                                cookbook: cookbook
                                            })}
                                        >
                                            <h2 className="heading leading-tight">
                                                {cookbook.title}
                                            </h2>
                                            <p className="text-sm mt-2">
                                                {cookbook.description}
                                            </p>
                                        </Book>
                                    );
                                })}
                            </Bookshelf>
                        ))}
                    </>
                ) : (
                    <p>
                        Oops! Something went wrong finding your cookbooks. <br />
                        Look in your kitchen and come back later.
                    </p>
                )}
            </section>
        </AuthenticatedLayout>
    );
}
