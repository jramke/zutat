<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;


// [Cookbook]
Breadcrumbs::for('cookbooks.index', function (BreadcrumbTrail $trail) {
    $trail->push("Home", route('cookbooks.index'), ['mobile' => 'Back to cookbooks']);
});

Breadcrumbs::for('cookbooks.show', function (BreadcrumbTrail $trail, $cookbook) {
    $trail->parent('cookbooks.index');
    $trail->push($cookbook->title, route('cookbooks.show', $cookbook), ['mobile' => 'Back to recipes']);
});

// [Cookbook] > [Recipe]
Breadcrumbs::for('recipes.form', function (BreadcrumbTrail $trail, $cookbook, $recipe) {
    $trail->parent('cookbooks.show', $cookbook);
    $trail->push($recipe->title ?? "New Recipe", route('recipes.form', $cookbook, $recipe), ['mobile' => '']);
});