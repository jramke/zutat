<?php

namespace App\Http\Controllers;

use App\Models\Cookbook;
use App\Models\User;
use App\Services\Breadcrumbs;
// use Diglactic\Breadcrumbs\Breadcrumbs;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CookbookController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Cookbooks/Index', [
            'cookbooks' => $request->user()->cookbooks,
        ]);
    }

    public function show(Cookbook $cookbook): Response
    {
        Breadcrumbs::generate('cookbooks.show', $cookbook);

        return Inertia::render('Cookbooks/Show', [
            'cookbook' => $cookbook,
            'recipes' => $cookbook->recipes,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $cookbook = $user->cookbooks()->create($data);

        return redirect()->route('cookbooks.show', $cookbook)->with('success', 'Cookbook created successfully.');
    }
}
