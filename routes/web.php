<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\CookbookController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    if (auth()->check() && $request->user()->hasVerifiedEmail()) {
        return redirect()->route('cookbooks.index');
    }

    return Inertia::render('Landing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');

Route::get('/home', function () {
    return Inertia::render('Landing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('landing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cookbooks', [CookbookController::class, 'index'])->name('cookbooks.index');
    Route::post('/cookbooks/create', [CookbookController::class, 'store'])->name('cookbooks.store');
    Route::get('/cookbooks/{cookbook}', [CookbookController::class, 'show'])->name('cookbooks.show');

    Route::get('/cookbooks/{cookbook}/recipes/{recipe?}', [RecipeController::class, 'form'])->name('recipes.form');
    Route::post('/cookbooks/{cookbook}/recipes', [RecipeController::class, 'store'])->name('recipes.store');
    Route::patch('/cookbooks/{cookbook}/recipes/{recipe}', [RecipeController::class, 'update'])->name('recipes.update');
    Route::delete('/cookbooks/{cookbook}/recipes/{recipe}', [RecipeController::class, 'destroy'])->name('recipes.destroy');
    // Route::prefix('u/{user:username}')->group(function () {

    //     Route::scopeBindings()->group(function () {
    //     });
    //     // Route::get('/{cookbook}', [CookbookController::class, 'show'])->name('cookbooks.show');
    //     // Route::get('/{cookbook}/recipes/create', [RecipeController::class, 'create'])->name('recipes.create');
    //     // Route::post('/{cookbook}/recipes/create', [RecipeController::class, 'store'])->name('recipes.store');
    // });
  
    // Route::get('/cookbooks/{cookbook}', [CookbookController::class, 'show'])->name('cookbooks.show');
    // Route::get('/cookbooks/create', [CookbookController::class, 'create'])->name('cookbooks.create');
    // Route::post('/cookbooks', [CookbookController::class, 'store'])->name('cookbooks.store');
    // Route::get('/cookbooks/{cookbook}/edit', [CookbookController::class, 'edit'])->name('cookbooks.edit');
    // Route::patch('/cookbooks/{cookbook}', [CookbookController::class, 'update'])->name('cookbooks.update');
    // Route::delete('/cookbooks/{cookbook}', [CookbookController::class, 'destroy'])->name('cookbooks.destroy');

    // Route::get('/recipes', [RecipeController::class, 'index'])->name('recipes.index');
    // Route::get('/recipes/create', [RecipeController::class, 'create'])->name('recipes.create');
    // Route::post('/recipes', [RecipeController::class, 'store'])->name('recipes.store');
    // Route::get('/recipes/{recipe}', [RecipeController::class, 'show'])->name('recipes.show');
    // Route::get('/recipes/{recipe}/edit', [RecipeController::class, 'edit'])->name('recipes.edit');
    // Route::patch('/recipes/{recipe}', [RecipeController::class, 'update'])->name('recipes.update');
    // Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy'])->name('recipes.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
