import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Cookbook, PageProps, Recipe, TODO } from "@/types";
import { Head, Link, usePage, usePoll } from "@inertiajs/react";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import CreateRecipeFromUrlForm from "./Partials/CreateRecipeFromUrlForm";

export default function Edit({ cookbook, recipes, auth }: PageProps<{ cookbook: Cookbook, recipes: Recipe[] }>) {
    const { title } = cookbook;
    
    // TODO: check if there are recipes extracting since maybe 2 minutes then delete them
    const isAnyRecipeExtracting = (recipes.filter((recipe) => recipe.is_extracting).length ?? 0) > 0;
    
    // TODO: inform user if recipe extraction failed

    const { start, stop } = usePoll(1000, { 
        only: ['recipes'],
        onStart() {},
        onFinish() {},
    }, { 
        autoStart: false
    });

    if (isAnyRecipeExtracting) {
        start();
    } else {
        stop();
    }

    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="content-grid prose">
                <h1>{title}</h1>

                <Link href={route("recipes.form", { cookbook })}>
                    Create from scratch
                </Link>
                <CreateRecipeFromUrlForm />
                {recipes.length > 0 ? (
                    <ul>
                        {recipes.map((recipe) => (
                            <li key={recipe.id}>
                                {recipe.is_extracting ? (
                                    <span>Extracting recipe...</span>
                                ) : (
                                    <Link href={route("recipes.form", { cookbook, recipe })}>
                                        {recipe.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recipes yet.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}