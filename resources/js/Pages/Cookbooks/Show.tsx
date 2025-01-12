import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Cookbook, PageProps, Recipe } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Edit({ cookbook, recipes, auth }: PageProps<{ cookbook: Cookbook, recipes: Recipe[] }>) {
    const { title } = cookbook;

    // console.log(recipes);
    // console.log(usePage());
    

    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="content-grid prose">
                <h1>{title}</h1>
                <Link href={route("recipes.form", { cookbook })}>
                    Create
                </Link>

                {recipes.length > 0 ? (
                    <ul>
                        {recipes.map((recipe) => (
                            <li key={recipe.id}>
                                <Link href={route("recipes.form", { cookbook, recipe })}>
                                {recipe.title}
                                </Link>
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
