<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    // Menampilkan profil pengguna yang sedang login
    public function show(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Berhasil mengambil data profil',
            'data' => $request->user()
        ], 200);
    }

    // Memperbarui profil, alergi, dan preferensi anggaran
    public function update(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'allergies' => 'nullable|string',
            'budget_preference' => 'nullable|string|in:Ekonomis,Menengah,Premium',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Perbarui data pengguna
        $user->update($request->only(['name', 'allergies', 'budget_preference']));

        return response()->json([
            'success' => true,
            'message' => 'Profil dan preferensi berhasil diperbarui',
            'data' => $user
        ], 200);
    }
}