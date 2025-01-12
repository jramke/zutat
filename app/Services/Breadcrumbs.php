<?php

namespace App\Services;

use Inertia\Inertia;
use Diglactic\Breadcrumbs\Breadcrumbs as BreadcrumbsGenerator;
use Illuminate\Support\Collection;

class Breadcrumbs
{
    protected static Collection|null $breadcrumbs = null;

    public static function generate(string $name, ...$params): void
    {
        self::$breadcrumbs = BreadcrumbsGenerator::generate($name, ...$params);
        self::share();
    }

    protected static function share(): void
    {
        Inertia::share('breadcrumbs', self::$breadcrumbs);
    }
}