# DermaMate.AI — AI Skin Analyzer & Personal Skincare Recommendation

**DermaMate.AI** adalah platform aplikasi web *End-to-End* berbasis *Computer Vision* dan *Deep Learning* yang dirancang untuk mendeteksi jenis serta kondisi kulit wajah ke dalam **5 kelas dermatologi** (**Jerawat/Acne, Kombinasi, Berminyak, Kering, dan Normal**) dan menyusun rekomendasi produk skincare secara personal berdasarkan riwayat alergi serta **3 tier anggaran** (**Ekonomis, Menengah, Premium**).

---

## ✨ Fitur Utama

1. **Pemindaian Wajah Fleksibel (*Dual Scan Mode*)**
   - **Live Webcam Capture**: Pengambilan foto wajah secara langsung melalui kamera perangkat dengan panduan bingkai fokus biometrik.
   - **Upload File Foto**: Unggah foto wajah beresolusi tinggi (JPG/PNG) dari galeri perangkat.
2. **Kuesioner Profil & Penyaringan Alergi Otomatis**
   - Validasi kondisi kulit pasca-cuci muka, penyaringan otomatis kandungan alergen (*Alcohol, Fragrance, Paraben*, dll.), serta penyesuaian preferensi *tier* anggaran.
3. **Klasifikasi AI 5 Kelas & Distribusi Probabilitas**
   - Menampilkan kelas kulit dominan, tingkat keyakinan (*confidence score*), grafik distribusi probabilitas seluruh 5 kelas, indikator masalah kulit, kandungan aktif yang direkomendasikan (*key ingredients*), serta kandungan yang perlu dihindari.
4. **Katalog Rekomendasi Skincare 3 Tier Harga**
   - Menampilkan daftar produk dari database MySQL lengkap dengan gambar produk/kemasan dinamis, waktu pemakaian (*Pagi/Malam*), kandungan utama, dan filter interaktif (*Semua Tier, Ekonomis, Menengah, Premium*).
5. **Skin History & Autentikasi Pengguna**
   - Sistem registrasi, login, dan logout aman menggunakan **Laravel Sanctum**, dilengkapi halaman riwayat pemindaian (*Skin History*) dengan fitur hapus riwayat beserta pembersihan file foto di penyimpanan server.
6. **Antarmuka Editorial *Warm Blush***
   - Desain estetis dengan palet warna *warm blush* (`#FFF8F6`), tipografi *Playfair Display* & *Plus Jakarta Sans*, serta ornamen vektor botani yang seragam di seluruh halaman.

---

## 🏗️ Arsitektur Sistem

Sistem **DermaMate.AI** dibangun menggunakan arsitektur *microservices* lokal yang menghubungkan tiga komponen utama melalui REST API:

| Komponen | Teknologi Utama | Port Default | Peran & Tanggung Jawab |
| :--- | :--- | :---: | :--- |
| **Frontend Web** | Next.js (App Router), TypeScript, Tailwind CSS | `3000` | Antarmuka pengguna (*Warm Blush UI*), akses *Live Webcam*, kuesioner, visualisasi hasil AI, dan riwayat scan. |
| **Backend API** | PHP 8.2+, Laravel, Laravel Sanctum, MySQL | `8000` | Manajemen autentikasi token, database produk & riwayat scan, penyimpanan file lokal (`storage` & `public`), serta penghubung ke layanan AI. |
| **AI Service** | Python, FastAPI, Uvicorn, PyTorch / EfficientNet-B0 | `8001` | Pemrosesan citra wajah dan inferensi model klasifikasi 5 kelas kulit melalui endpoint `POST /analyze`. |

---

## 📂 Struktur Direktori Proyek

```text
DermaMate/
├── dermamate-frontend/               # Aplikasi Frontend Next.js (Port 3000)
│   ├── src/app/
│   │   ├── page.tsx                  # Alur utama (Beranda, Scan, Kuesioner, Diagnosis, Rekomendasi)
│   │   ├── history/page.tsx          # Halaman Riwayat Pemindaian (Skin History & Hapus Riwayat)
│   │   └── login/page.tsx            # Halaman Login & Registrasi Pengguna
│   ├── next.config.ts                # Konfigurasi Next.js & Turbopack
│   └── package.json
│
├── dermamate-backend/                # Aplikasi Backend Laravel (Port 8000)
│   ├── app/Http/Controllers/Api/
│   │   ├── AuthController.php        # Endpoint Register, Login & Logout (Sanctum)
│   │   └── SkinScanController.php    # Orkestrasi ke FastAPI /analyze, filter produk & hapus riwayat
│   ├── app/Models/
│   │   ├── Product.php               # Model tabel products (termasuk kolom image_url)
│   │   └── SkinScan.php              # Model tabel skin_scans
│   ├── database/migrations/          # Skema tabel users, products, skin_scans, personal_access_tokens
│   ├── public/images/products/       # Aset foto asli & kemasan SVG produk skincare
│   ├── routes/api.php                # Definisi rute REST API
│   └── .env                          # Konfigurasi database & AI_SERVICE_URL
│
└── dermamate-ai/                     # Layanan Inferensi FastAPI (Port 8001)
    ├── main.py                       # Server FastAPI & endpoint POST /analyze (multipart/form-data)
    ├── model/                        # File bobot model terlatih (5 kelas kulit)
    └── requirements.txt
```

---

## 🚀 Panduan Instalasi & Menjalankan Secara Lokal

Pastikan **XAMPP / MySQL**, **PHP & Composer**, **Node.js**, dan **Python** sudah terpasang di perangkat Anda. Jalankan ketiga layanan berikut pada terminal terpisah:

### 1. Menjalankan Layanan AI (FastAPI — Port 8001)
```bash
cd dermamate-ai
python -m venv venv
venv\Scripts\activate          # Windows (gunakan `source venv/bin/activate` di Linux/macOS)
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```
Pastikan dokumentasi Swagger dapat diakses di `http://127.0.0.1:8001/docs` dengan endpoint aktif `POST /analyze`.

### 2. Menjalankan Backend API (Laravel — Port 8000)
```bash
cd dermamate-backend
composer install
cp .env.example .env
php artisan key:generate
```
Buka file `.env`, lalu sesuaikan konfigurasi database MySQL dan alamat layanan AI:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lokal_dermamite
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public
AI_SERVICE_URL=http://127.0.0.1:8001/analyze
```
Jalankan migrasi tabel, buat *symbolic link* penyimpanan publik, lalu nyalakan server Laravel:
```bash
php artisan migrate
php artisan storage:link
php artisan serve --port=8000
```

### 3. Menjalankan Frontend Web (Next.js — Port 3000)
```bash
cd dermamate-frontend
npm install
npm run dev
```
Buka browser Anda dan akses **`http://localhost:3000`**.

---

## 🔌 Dokumentasi Singkat REST API

| Method | Endpoint | Layanan | Autentikasi | Keterangan |
| :---: | :--- | :---: | :---: | :--- |
| `POST` | `/analyze` | FastAPI (`8001`) | Publik | Menerima field `file` (`multipart/form-data`) dan mengembalikan prediksi kelas + probabilitas 5 kelas. |
| `POST` | `/api/register` | Laravel (`8000`) | Publik | Mendaftarkan akun pengguna baru dan mengembalikan token Sanctum. |
| `POST` | `/api/login` | Laravel (`8000`) | Publik | Memverifikasi kredensial pengguna dan menghasilkan `access_token`. |
| `POST` | `/api/logout` | Laravel (`8000`) | Bearer Token | Mencabut token sesi aktif pengguna (*Sign Out*). |
| `GET` | `/api/skin-scans` | Laravel (`8000`) | Bearer Token | Mengambil daftar riwayat pemindaian kulit milik pengguna yang sedang login. |
| `POST` | `/api/skin-scans` | Laravel (`8000`) | Bearer Token | Menyimpan foto scan, memanggil AI `/analyze`, menyimpan hasil diagnosis, dan memfilter produk. |
| `DELETE` | `/api/skin-scans/{id}` | Laravel (`8000`) | Bearer Token | Menghapus catatan riwayat scan beserta file gambarnya dari `storage/app/public/scans`. |

---

## ⚠️ Catatan Privasi & Penafian Medis

- Foto wajah yang dipindai disimpan secara pribadi pada akun pengguna masing-masing dan dapat dihapus kapan saja melalui menu **Skin History**.
- Hasil analisis **DermaMate.AI** merupakan asisten pendamping perawatan kulit harian dan **bukan pengganti diagnosis medis klinis** dari dokter spesialis kulit (Sp.KK).