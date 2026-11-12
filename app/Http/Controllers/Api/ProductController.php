<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    // Mengambil semua data produk atau memfilter berdasarkan kategori/tier harga
    public function index(Request $request)
    {
        $query = DB::table('products');

        // Filter opsional berdasarkan tier harga (Ekonomis, Menengah, Premium)
        if ($request->has('price_tier')) {
            $query->where('price_tier', $request->price_tier);
        }

        // Filter opsional berdasarkan jenis kulit
        if ($request->has('skin_type')) {
            $query->where('skin_type', 'like', '%' . $request->skin_type . '%');
        }

        $products = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data katalog produk skincare',
            'data' => $products
        ], 200);
    }
}