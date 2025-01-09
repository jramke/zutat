import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Cookbook, PageProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function Edit({
    cookbook,
}: PageProps<{ cookbook: Cookbook }>) {

    console.log(cookbook);
    const { title } = cookbook;

    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="content-grid">
                <h1 className="h1">{title}</h1>
            </div>
            
        </AuthenticatedLayout>
    );
}
