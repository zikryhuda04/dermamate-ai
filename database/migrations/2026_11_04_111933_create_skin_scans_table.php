<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('skin_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('image_path'); // <-- Hapus ->after('user_id') di sini
            $table->string('skin_type'); // Contoh: Berminyak, Kering, Kombinasi, Normal
            $table->text('skin_issues'); // Contoh: Jerawat, Kemerahan, Pori-pori
            $table->text('recommendations')->nullable(); // Rekomendasi kandungan/produk
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skin_scans');
    }
};