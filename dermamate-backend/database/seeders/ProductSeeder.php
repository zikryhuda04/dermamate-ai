<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->insert([
            // 1. Produk Kulit Berminyak (Oily)
            [
                'brand' => 'Emina',
                'product_name' => 'Bright Stuff For Acne Prone Skin Face Wash',
                'category' => 'Cleanser',
                'skin_type' => 'Berminyak, Berjerawat',
                'target_problem' => 'Jerawat, Minyak Berlebih',
                'key_ingredients' => 'Cinnamon Bark Extract, Salicylic Acid',
                'price_idr' => 28000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Sabun muka yang membantu membersihkan minyak berlebih dan merawat kulit berjerawat.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'brand' => 'The Originote',
                'product_name' => 'Cica-B5 Soothing Moisturizer Gel',
                'category' => 'Moisturizer',
                'skin_type' => 'Berminyak, Berjerawat',
                'target_problem' => 'Minyak berlebih, Jerawat, Kemerahan',
                'key_ingredients' => 'Centella Asiatica, Panthenol (B5)',
                'price_idr' => 45000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pelembap bertekstur gel ringan yang menenangkan jerawat dan mengontrol sebum.',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 2. Produk Kulit Kering (Dry)
            [
                'brand' => 'Skintific',
                'product_name' => '5X Ceramide Barrier Repair Moisture Gel',
                'category' => 'Moisturizer',
                'skin_type' => 'Kering, Sensitif',
                'target_problem' => 'Skin barrier rusak, Kulit kering, Kemerahan',
                'key_ingredients' => '5 Tipe Ceramide, Hyaluronic Acid, Centella',
                'price_idr' => 135000,
                'price_tier' => 'Menengah',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pelembap intensif yang memperbaiki dan memperkuat skin barrier yang kering.',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // 3. Produk Kulit Normal
            [
                'brand' => 'Simple',
                'product_name' => 'Kind to Skin Refreshing Facial Wash',
                'category' => 'Cleanser',
                'skin_type' => 'Normal, Sensitif',
                'target_problem' => 'Pembersihan harian, Menjaga hidrasi alami',
                'key_ingredients' => 'Pro-Vitamin B5, Vitamin E',
                'price_idr' => 65000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pembersih lembut tanpa pewangi dan pewarna keras untuk menjaga keseimbangan kulit normal.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'brand' => 'Skintific',
                'product_name' => '5X Ceramide Low pH Cleanser',
                'category' => 'Cleanser',
                'skin_type' => 'Semua Jenis Kulit, Normal',
                'target_problem' => 'Skin barrier rusak, Kemerahan',
                'key_ingredients' => 'Ceramide, Hyaluronic Acid, Centella Asiatica',
                'price_idr' => 99000,
                'price_tier' => 'Menengah',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pembersih wajah dengan pH balanced untuk membersihkan kulit sekaligus merawat skin barrier.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'brand' => 'Skintific',
                'product_name' => 'Niacinamide 10% Brightening Serum',
                'category' => 'Serum',
                'skin_type' => 'Semua Jenis Kulit, Normal',
                'target_problem' => 'Flek hitam, Kusam, Bekas jerawat',
                'key_ingredients' => 'Royal DSM Niacinamide, Alpha Arbutin',
                'price_idr' => 129000,
                'price_tier' => 'Menengah',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Serum pencerah dengan Niacinamide murni untuk menyamarkan noda hitam.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'brand' => 'Lancome',
                'product_name' => 'Advanced Genifique Serum',
                'category' => 'Serum',
                'skin_type' => 'Semua Jenis Kulit, Penuaan Dini',
                'target_problem' => 'Anti-aging, Kulit lelah',
                'key_ingredients' => 'Bifida Ferment Lysate, Prebiotics',
                'price_idr' => 1500000,
                'price_tier' => 'Premium',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Serum anti-aging kelas premium untuk mengembalikan keremajaan dan kilau kulit.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}