import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
};

export interface Breadcrumb {
    title: string;
    url: string;
    mobile: string;
}

export interface OptionEnum {
    name: string;
    value: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    breadcrumbs?: Breadcrumb[];
    enums: Record<string, OptionEnum[]>;
    cookbook?: Cookbook,
    recipe?: Recipe
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
    description?: string;
    instructions?: any;
    ingredients?: IngredientGroup[];
    nutrition_per_serving?: Nutrition;
    difficulty?: string;
    prep_time?: string;
    cook_time?: string;
    servings: number;
    is_locked: boolean;
    order: number;
    is_extracting: boolean;
}

export interface IngredientGroup {
    name: string;
    items: Ingredient[];
}

export interface Ingredient {
    item: string;
    quantity: string;
    unit: string;
}

export interface Nutrition {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
}