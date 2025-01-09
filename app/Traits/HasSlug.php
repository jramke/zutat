<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

trait HasSlug
{
    protected static function bootHasSlug()
    {
        static::creating(function (Model $model) {
            $model->slug = self::generateUniqueSlug($model);
        });

        static::updating(function (Model $model) {
            if ($model->isDirty($model->slugSourceColumn())) {
                $model->slug = self::generateUniqueSlug($model);
            }
        });
    }

    private static function generateUniqueSlug($model)
    {
        $slug = Str::slug($model->{$model->slugSourceColumn()});
        $count = 1;

        $query = static::where($model->getSlugScopeColumn(), $model->{$model->getSlugScopeColumn()})->where('slug', $slug);

        if ($model->exists) {
            $query->where('id', '!=', $model->id);
        }

        while ($query->exists()) {
            $slug = Str::slug($model->{$model->slugSourceColumn()}) . '-' . $count;
            $count++;
            $query = static::where($model->getSlugScopeColumn(), $model->{$model->getSlugScopeColumn()})->where('slug', $slug);
            if ($model->exists) {
                $query->where('id', '!=', $model->id);
            }
        }

        return $slug;
    }

    public function slugSourceColumn(): string
    {
        return 'title';
    }

    public function getSlugScopeColumn(): string
    {
        return $this->slugScopeColumn ?? 'user_id';
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
