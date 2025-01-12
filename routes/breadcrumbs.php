<?php

use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;


// [Cookbook]
Breadcrumbs::for('cookbooks.show', function (BreadcrumbTrail $trail, $cookbook) {
    $trail->push($cookbook->title, route('cookbooks.show', $cookbook));
});

// [Cookbook] > [Recipe]
Breadcrumbs::for('recipes.form', function (BreadcrumbTrail $trail, $cookbook, $recipe) {
    $trail->parent('cookbooks.show', $cookbook);
    $trail->push($recipe->title ?? "New Recipe", route('recipes.form', $cookbook, $recipe));
});