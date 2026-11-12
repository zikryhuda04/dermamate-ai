<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SkinScanController;
use App\Http\Controllers\Api\ProfileController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rute Produk Skincare (Publik)
Route::get('/products', [ProductController::class, 'index']);

// Rute Autentikasi Pengguna
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rute yang memerlukan autentikasi token (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/skin-scans', [SkinScanController::class, 'index']);
    Route::post('/skin-scans', [SkinScanController::class, 'store']);

    // Rute Profil & Preferensi Pengguna
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
});