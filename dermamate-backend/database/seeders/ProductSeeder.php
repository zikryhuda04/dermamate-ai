<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // =================================================================
            // 1. KELAS: JERAWAT (ACNE)
            // =================================================================
            [
                'brand' => 'Emina',
                'product_name' => 'Bright Stuff For Acne Prone Skin Face Wash',
                'category' => 'Cleanser',
                'skin_type' => 'Jerawat (Acne), Berminyak',
                'target_problem' => 'Jerawat, Minyak Berlebih',
                'key_ingredients' => 'Cinnamon Bark Extract, Salicylic Acid',
                'price_idr' => 28000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Sabun muka yang membantu membersihkan minyak berlebih dan merawat kulit berjerawat.',
            ],
            [
                'brand' => 'Skintific',
                'product_name' => '2% Salicylic Acid Anti Acne Serum',
                'category' => 'Serum',
                'skin_type' => 'Jerawat (Acne)',
                'target_problem' => 'Jerawat aktif, Pori tersumbat, Kemerahan',
                'key_ingredients' => '2% ACSD Salicylic Acid, Niacinamide, Ceramide',
                'price_idr' => 119000,
                'price_tier' => 'Menengah',
                'routine_time' => 'Malam',
                'description' => 'Serum dengan teknologi enkapsulasi Salicylic Acid untuk meredakan jerawat meradang tanpa mengiritasi kulit.',
            ],
            [
                'brand' => 'Azarine',
                'product_name' => 'Calm My Acne Sunscreen Moisturiser SPF 35 PA+++',
                'category' => 'Sunscreen',
                'skin_type' => 'Jerawat (Acne), Berminyak',
                'target_problem' => 'Perlindungan UV untuk kulit berjerawat dan sensitif',
                'key_ingredients' => 'Bakuchiol, Pionin, Canadian Willowherb, Ectoin',
                'price_idr' => 39000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi',
                'description' => 'Tabir surya bebas minyak dan alkohol dengan tekstur gel ringan yang menenangkan kemerahan akibat jerawat.',
            ],

            // =================================================================
            // 2. KELAS: KOMBINASI
            // =================================================================
            [
                'brand' => 'Wardah',
                'product_name' => 'Hydra Rose Gel to Foam Cleanser',
                'category' => 'Cleanser',
                'skin_type' => 'Kombinasi, Normal',
                'target_problem' => 'T-zone berminyak, Area pipi kering',
                'key_ingredients' => 'Avalanche Rose Oil, 72 Hours Hydrating Active',
                'price_idr' => 33000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pembersih wajah bertekstur gel yang menyeimbangkan minyak di area T-zone sambil menjaga kelembapan area pipi yang kering.',
            ],
            [
                'brand' => 'NPURE',
                'product_name' => 'Centella Asiatica Face Toner',
                'category' => 'Toner',
                'skin_type' => 'Kombinasi, Jerawat (Acne)',
                'target_problem' => 'Keseimbangan pH kulit, Kemerahan ringan',
                'key_ingredients' => 'Centella Asiatica Leaf Water, Green Tea, Mix Fruit Extract',
                'price_idr' => 95000,
                'price_tier' => 'Menengah',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Toner penyegar dengan ekstrak daun Centella asli yang menenangkan sekaligus menyeimbangkan kadar air dan minyak wajah.',
            ],
            [
                'brand' => 'Somethinc',
                'product_name' => 'Ceramic Skin Saviour Moisturizer Gel',
                'category' => 'Moisturizer',
                'skin_type' => 'Kombinasi, Normal',
                'target_problem' => 'Tekstur tidak merata, Dehidrasi ringan',
                'key_ingredients' => 'Hydrolyzed Marine Collagen, Palmitoyl Tripeptide, Ceramide NP',
                'price_idr' => 169000,
                'price_tier' => 'Premium',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pelembap gel-krim ringan yang cepat meresap, memberikan hidrasi optimal tanpa memicu minyak berlebih di area T-zone.',
            ],

            // =================================================================
            // 3. KELAS: BERMINYAK
            // =================================================================
            [
                'brand' => 'The Originote',
                'product_name' => 'Cica-B5 Soothing Moisturizer Gel',
                'category' => 'Moisturizer',
                'skin_type' => 'Berminyak, Jerawat (Acne)',
                'target_problem' => 'Minyak berlebih, Jerawat, Kemerahan',
                'key_ingredients' => 'Centella Asiatica, Panthenol (B5)',
                'price_idr' => 45000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pelembap bertekstur gel ringan yang menenangkan jerawat dan mengontrol sebum.',
            ],
            [
                'brand' => 'Cosrx',
                'product_name' => 'Low pH Good Morning Gel Cleanser',
                'category' => 'Cleanser',
                'skin_type' => 'Berminyak, Kombinasi',
                'target_problem' => 'Produksi sebum berlebih, Pori-pori besar',
                'key_ingredients' => 'Tea Tree Oil, Betaine Salicylate (BHA)',
                'price_idr' => 125000,
                'price_tier' => 'Menengah',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pembersih wajah ber-pH rendah yang mengangkat minyak berlebih tanpa merusak lapisan pelindung alami kulit.',
            ],

            // =================================================================
            // 4. KELAS: KERING
            // =================================================================
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
            ],
            [
                'brand' => 'Hada Labo',
                'product_name' => 'Gokujyun Ultimate Moisturizing Lotion',
                'category' => 'Toner',
                'skin_type' => 'Kering, Normal',
                'target_problem' => 'Kulit kering, Terasa ketarik, Dehidrasi',
                'key_ingredients' => '3 Types of Hyaluronic Acid',
                'price_idr' => 45000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Hydrating toner intensif yang mengunci kelembapan jauh ke dalam lapisan epidermis untuk mengatasi kulit kering dan bersisik.',
            ],

            // =================================================================
            // 5. KELAS: NORMAL (DAN SEMUA JENIS KULIT)
            // =================================================================
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
            ],
            [
                'brand' => 'Skintific',
                'product_name' => '5X Ceramide Low pH Cleanser',
                'category' => 'Cleanser',
                'skin_type' => 'Semua Jenis Kulit, Normal, Kering',
                'target_problem' => 'Skin barrier rusak, Kemerahan',
                'key_ingredients' => 'Ceramide, Hyaluronic Acid, Centella Asiatica',
                'price_idr' => 99000,
                'price_tier' => 'Menengah',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Pembersih wajah dengan pH balanced untuk membersihkan kulit sekaligus merawat skin barrier.',
            ],
            [
                'brand' => 'Skintific',
                'product_name' => 'Niacinamide 10% Brightening Serum',
                'category' => 'Serum',
                'skin_type' => 'Semua Jenis Kulit, Normal, Kombinasi',
                'target_problem' => 'Flek hitam, Kusam, Bekas jerawat',
                'key_ingredients' => 'Royal DSM Niacinamide, Alpha Arbutin',
                'price_idr' => 129000,
                'price_tier' => 'Menengah',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Serum pencerah dengan Niacinamide murni untuk menyamarkan noda hitam dan meratakan warna kulit.',
            ],
            [
                'brand' => 'Wardah',
                'product_name' => 'UV Shield Essential Gel Sunscreen Serum SPF 35 PA+++',
                'category' => 'Sunscreen',
                'skin_type' => 'Semua Jenis Kulit, Normal',
                'target_problem' => 'Perlindungan sinar UVA/UVB harian',
                'key_ingredients' => 'Vitamin E, Pro-Vitamin B5, Glutathione',
                'price_idr' => 37000,
                'price_tier' => 'Ekonomis',
                'routine_time' => 'Pagi',
                'description' => 'Tabir surya harian dengan tekstur ringan tanpa whitecast untuk menjaga kondisi kulit normal tetap sehat.',
            ],
            [
                'brand' => 'Lancome',
                'product_name' => 'Advanced Genifique Serum',
                'category' => 'Serum',
                'skin_type' => 'Semua Jenis Kulit, Penuaan Dini, Normal',
                'target_problem' => 'Anti-aging, Kulit lelah',
                'key_ingredients' => 'Bifida Ferment Lysate, Prebiotics',
                'price_idr' => 1500000,
                'price_tier' => 'Premium',
                'routine_time' => 'Pagi, Malam',
                'description' => 'Serum anti-aging kelas premium untuk mengembalikan keremajaan dan kilau kulit.',
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->updateOrInsert(
                ['product_name' => $product['product_name']],
                array_merge($product, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}