<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // Mengambil semua daftar produk atau memfilter berdasarkan jenis kulit & tier harga
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('skin_type')) {
            $query->where('skin_type', 'like', '%' . $request->skin_type . '%');
        }

        if ($request->has('price_tier')) {
            $query->where('price_tier', $request->price_tier);
        }

        $products = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
}