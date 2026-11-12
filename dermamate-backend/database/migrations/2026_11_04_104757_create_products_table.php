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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('brand', 50);
            $table->string('product_name', 150);
            $table->enum('category', ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen']);
            $table->string('skin_type', 100);
            $table->string('target_problem', 100);
            $table->text('key_ingredients');
            $table->integer('price_idr');
            $table->enum('price_tier', ['Ekonomis', 'Menengah', 'Premium']);
            $table->enum('routine_time', ['Pagi', 'Malam', 'Pagi, Malam']);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};