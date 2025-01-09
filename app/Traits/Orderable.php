<?php

namespace App\Traits;

trait Orderable
{
    public function moveOrder($direction)
    {
        $currentOrder = $this->order;
        
        if ($direction === 'up') {
            $swapWith = $this->where('cookbook_id', $this->cookbook_id)
                            ->where('order', '<', $currentOrder)
                            ->orderBy('order', 'desc')
                            ->first();
        } else {
            $swapWith = $this->where('cookbook_id', $this->cookbook_id)
                            ->where('order', '>', $currentOrder)
                            ->orderBy('order', 'asc')
                            ->first();
        }
        
        if ($swapWith) {
            $oldOrder = $swapWith->order;
            $swapWith->update(['order' => $currentOrder]);
            $this->update(['order' => $oldOrder]);
        }
    }

    public static function reorder($items)
    {
        foreach ($items as $index => $id) {
            static::where('id', $id)->update(['order' => $index]);
        }
    }
}
