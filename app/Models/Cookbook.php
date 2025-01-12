<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cookbook extends Model
{
    use HasSlug;

    protected $fillable = ['title', 'description', 'order'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recipes()
    {
        return $this->hasMany(Recipe::class)->orderBy('order');
    }

    // public function resolveRouteBinding($value, $field = null)
    // {
    //     return $this->where('slug', $value)->where('user_id', request()->route('user')->id)->firstOrFail();
    // }
    // public function resolveChildRouteBinding($childType, $value, $field)
    // {
    //     return $this->where('slug', $value)
    //         ->where('user_id', request()->route('user')->id)
    //         ->firstOrFail();
    // }
    // public function resolveChildRouteBinding($childType, $value, $field)
    // {
    //     if ($childType === 'recipe') {
    //         return $this->recipes()->where('slug', $value)->firstOrFail();
    //     }

    //     return parent::resolveChildRouteBinding($childType, $value, $field);
    // }
}
