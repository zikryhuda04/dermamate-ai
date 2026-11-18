<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SkinScan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class SkinScanController extends Controller
{
    public function index(Request $request)
    {
        $scans = SkinScan::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $scans,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:4096',
            'allergy' => 'nullable|string|max:255',
            'budget_preference' => 'nullable|string|max:50',
        ]);

        // 1. Simpan gambar ke storage/app/public/scans
        $imagePath = $request->file('image')->store('scans', 'public');
        $fullImagePath = Storage::disk('public')->path($imagePath);

        // 2. Panggil layanan AI FastAPI (Port 8001, endpoint /analyze)
        $aiServiceUrl = env('AI_SERVICE_URL', 'http://127.0.0.1:8001/analyze');

        try {
            $aiResponse = Http::timeout(30)
                ->attach('file', file_get_contents($fullImagePath), basename($fullImagePath))
                ->post($aiServiceUrl);

            if (!$aiResponse->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Layanan AI gagal memproses gambar: ' . $aiResponse->body(),
                ], 502);
            }

            $aiData = $aiResponse->json();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat terhubung ke server AI (Port 8001): ' . $e->getMessage(),
            ], 503);
        }

        // 3. Tentukan kelas pemenang dari probabilitas tertinggi atau key JSON FastAPI
        $probs = $aiData['all_probabilities'] ?? $aiData['probabilities'] ?? [];
        $topClassFromProbs = null;
        $topConfidence = $aiData['confidence'] ?? null;

        if (is_array($probs) && count($probs) > 0) {
            arsort($probs);
            $topClassFromProbs = array_key_first($probs);
            if ($topConfidence === null) {
                $topConfidence = reset($probs);
            }
        }

        $rawClass = strtolower(trim((string) (
            $topClassFromProbs
            ?? $aiData['predicted_class']
            ?? $aiData['predicted_label']
            ?? $aiData['label']
            ?? $aiData['skin_type']
            ?? $aiData['prediction']
            ?? $aiData['class']
            ?? $aiData['result']
            ?? 'normal'
        )));

        $classMap = [
            'acne'             => 'Jerawat (Acne)',
            'jerawat'          => 'Jerawat (Acne)',
            'jerawat (acne)'   => 'Jerawat (Acne)',
            'combination'      => 'Kombinasi',
            'kombinasi'        => 'Kombinasi',
            'oily'             => 'Berminyak',
            'berminyak'        => 'Berminyak',
            'dry'              => 'Kering',
            'kering'           => 'Kering',
            'normal'           => 'Normal',
        ];
        $skinType = $classMap[$rawClass] ?? 'Normal';

        $issuesMap = [
            'Jerawat (Acne)' => 'Terdapat peradangan jerawat aktif, kemerahan, dan pori-pori tersumbat.',
            'Kombinasi'      => 'Area T-Zone (dahi, hidung, dagu) cenderung berminyak sementara area pipi normal/kering.',
            'Berminyak'      => 'Produksi sebum berlebih, pori-pori tampak besar, dan rentan komedo.',
            'Kering'         => 'Kelembapan rendah, tekstur kulit terasa kencang atau bersisik.',
            'Normal'         => 'Keseimbangan kadar air dan minyak terjaga dengan baik.',
        ];

        $adviceMap = [
            'Jerawat (Acne)' => 'Gunakan pembersih lembut berbahan Salicylic Acid atau Centella Asiatica, serta hindari memencet jerawat.',
            'Kombinasi'      => 'Gunakan pembersih seimbang (pH balanced) dan pelembap ringan berbahan Niacinamide.',
            'Berminyak'      => 'Gunakan pembersih wajah berbahan Salicylic Acid dan pelembap berbasis air (oil-free).',
            'Kering'         => 'Gunakan pembersih non-stripping dan pelembap dengan Ceramide atau Hyaluronic Acid.',
            'Normal'         => 'Pertahankan rutinitas pembersih lembut, pelembap ringan, dan tabir surya (sunscreen) setiap pagi.',
        ];

        // Tambahkan catatan masalah jerawat jika probabilitas acne cukup tinggi (> 20%) meski kelas utama Berminyak
        $detectedIssues = $issuesMap[$skinType];
        $acneProb = $probs['acne'] ?? $probs['Acne'] ?? $probs['jerawat'] ?? 0;
        if ($skinType !== 'Jerawat (Acne)' && $acneProb >= 0.20) {
            $detectedIssues .= ' Terdeteksi juga indikasi jerawat ringan/aktif (' . round($acneProb * 100, 1) . '%).';
        }

        // 4. Ambil produk skincare berdasarkan kolom 'skin_type' & filter alergi
        $query = Product::where(function ($q) use ($skinType) {
            $q->where('skin_type', 'LIKE', '%' . $skinType . '%')
              ->orWhere('skin_type', 'LIKE', '%Semua%');
        });

        if ($request->filled('allergy')) {
            $allergies = array_filter(array_map('trim', explode(',', $request->allergy)));
            foreach ($allergies as $allergy) {
                $query->where('key_ingredients', 'NOT LIKE', '%' . $allergy . '%');
            }
        }

        $products = $query->get();
        $productNames = $products->pluck('product_name')->take(3)->implode(', ');
        $recommendationText = $adviceMap[$skinType] . ($productNames ? ' Rekomendasi produk yang cocok: ' . $productNames . '.' : '');

        // 5. Simpan hasil ke tabel skin_scans
        $scan = SkinScan::create([
            'user_id'         => $request->user()->id,
            'image_path'      => $imagePath,
            'skin_type'       => $skinType,
            'skin_issues'     => $detectedIssues,
            'recommendations' => $recommendationText,
        ]);

        return response()->json([
            'success'              => true,
            'message'              => 'Analisis kulit wajah berhasil disimpan.',
            'data'                 => $scan,
            'confidence'           => $topConfidence ?? 0.85,
            'all_probabilities'    => $probs ?: null,
            'recommended_products' => $products,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $scan = SkinScan::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$scan) {
            return response()->json([
                'success' => false,
                'message' => 'Data riwayat scan tidak ditemukan atau Anda tidak memiliki akses.',
            ], 404);
        }

        if ($scan->image_path && Storage::disk('public')->exists($scan->image_path)) {
            Storage::disk('public')->delete($scan->image_path);
        }

        $scan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Riwayat pemindaian berhasil dihapus.',
        ]);
    }
}