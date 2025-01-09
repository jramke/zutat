<?php

namespace App\Http\Controllers;

use App\Models\Cookbook;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CookbookController extends Controller
{
    public function index(User $user): Response
    {
        return Inertia::render('Cookbooks/Index', [
            'cookbooks' => $user->cookbooks,
        ]);
    }

    public function show(User $user, Cookbook $cookbook): Response
    {
        return Inertia::render('Cookbooks/Show', [
            'cookbook' => $cookbook,
        ]);
    }

    public function store(User $user, Request $request)
    {
        sleep(2);
        $user->cookbooks()->create([
            'title' => $request->title,
            'description' => $request->description,
        ]);
    }
}
