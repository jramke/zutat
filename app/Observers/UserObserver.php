<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function created(User $user)
    {
        $realName = $user->name ?? $user->username;
        $user->cookbooks()->create([
            'title' => $realName . '\'s Cookbook',
            'description' => 'Your default recipe collection'
        ]);
    }
}