import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    email_verified_at?: string;
};

export interface Breadcrumb {
    title: string;
    url: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    breadcrumbs?: Breadcrumb[];
};

export type TODO = any;

export interface Cookbook {
    id: number;
    title: string;
    slug: string;
    description: string;
    order: number;
}

export interface Recipe {
    id: number;
    title: string;
    description: string;
    content: any;
    order: number;
}