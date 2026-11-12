<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'product_name',
        'category',
        'skin_type',
        'target_problem',
        'key_ingredients',
        'price_idr',
        'price_tier',
        'routine_time',
        'description',
    ];
}