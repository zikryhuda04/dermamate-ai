<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkinScan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'image_path',
        'skin_type',
        'skin_issues',
        'recommendations',
    ];
}