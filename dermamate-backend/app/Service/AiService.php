<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    protected $aiServiceUrl;

    public function __construct()
    {
        // Alamat URL tempat FastAPI Anda berjalan
        $this->aiServiceUrl = 'http://127.0.0.1:8000';
    }

    public function analyzeSkin($imagePath)
    {
        try {
            // Mengirim file gambar ke endpoint /analyze di FastAPI
            $response = Http::attach(
                'file', file_get_contents($imagePath), basename($imagePath)
            )->post("{$this->aiServiceUrl}/analyze");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            }

            return [
                'success' => false,
                'message' => 'Gagal mendapatkan analisis dari layanan AI.'
            ];
        } catch (\Exception $e) {
            Log::error('AI Service Error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Terjadi kesalahan koneksi ke layanan AI.'
            ];
        }
    }
}