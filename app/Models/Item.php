<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $guarded = [];


    public function parent()
    {
        return $this->where('itemId', $this->parentId)->first();
    }
}
