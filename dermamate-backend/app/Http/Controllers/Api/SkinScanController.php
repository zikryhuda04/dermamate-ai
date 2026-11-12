<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SkinScan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class SkinScanController extends Controller
{
    // Mengambil seluruh riwayat pemindaian pengguna
    public function index(Request $request)
    {
        $scans = SkinScan::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil riwayat skin scan',
            'data' => $scans
        ], 200);
    }

    // Memproses unggahan gambar wajah, inferensi AI, dan menyimpan hasil
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $image = $request->file('image');

        try {
            // Kirim gambar ke layanan FastAPI di port 8001
            $response = Http::attach(
                'file',
                file_get_contents($image->getRealPath()),
                $image->getClientOriginalName()
            )->post('http://127.0.0.1:8001/analyze');

            if ($response->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal memproses analisis gambar dengan layanan AI.'
                ], 500);
            }

            $aiResult = $response->json();
            $predictedSkinType = $aiResult['skin_type'] ?? 'Normal';

            // Query produk yang cocok dari tabel products
            $matchedProducts = Product::where('skin_type', 'LIKE', "%{$predictedSkinType}%")
                ->orWhere('target_problem', 'LIKE', "%{$predictedSkinType}%")
                ->limit(3)
                ->pluck('product_name')
                ->implode(', ');

            $finalRecommendation = ($aiResult['recommendations'] ?? '');
            if (!empty($matchedProducts)) {
                $finalRecommendation .= " Rekomendasi produk yang cocok: {$matchedProducts}.";
            }

            // Simpan gambar ke storage publik
            $imagePath = $image->store('scans', 'public');

            // Simpan data pemindaian ke tabel skin_scans
            $skinScan = SkinScan::create([
                'user_id' => $request->user()->id,
                'image_path' => $imagePath,
                'skin_type' => $predictedSkinType,
                'skin_issues' => $aiResult['skin_issues'] ?? 'Kondisi kulit normal.',
                'recommendations' => trim($finalRecommendation),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Analisis kulit dan penyimpanan riwayat berhasil',
                'confidence' => $aiResult['confidence'] ?? null,
                'data' => $skinScan
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem: ' . $e->getMessage()
            ], 500);
        }
    }
}