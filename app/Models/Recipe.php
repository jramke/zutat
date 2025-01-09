<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Traits\Orderable;

class Recipe extends Model
{
    use Orderable, HasSlug;

    protected $fillable = ['title', 'description', 'content', 'order'];

    protected $slugScopeColumn = 'cookbook_id';

    protected $casts = [
        'content' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cookbook()
    {
        return $this->belongsTo(Cookbook::class);
    }
}
