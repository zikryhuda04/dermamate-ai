# DOKUMEN WORKFLOW & ARSITEKTUR SISTEM DERMAMATE AI
**Project:** DermaMate AI: Your Personal AI Skincare Companion (Web Platform)  
**Referensi Utama:** *Project Charter DermaMate AI v1.0* & *Artifacts AI Model Repository*  
**Organisasi / Institusi:** Universitas Negeri Padang (UNP)  

---

## 1. Ringkasan Eksekutif & Tujuan Sistem

DermaMate AI adalah platform *web-based personal skincare companion* berbasis kecerdasan buatan (*Computer Vision & Deep Learning*). Sistem ini dirancang untuk memecahkan kebingungan pemula dalam menentukan tipe dan kondisi kulit wajah tanpa perlu biaya konsultasi klinis yang mahal, serta mencegah salah beli produk (*breakout*).

### KPI & Target Kunci (Sesuai Project Charter):
1. **Akurasi Model AI:** Target validasi/test $\ge 85\%$ (Tercapai pada model *winner* **EfficientNet-B0**: Test Accuracy **85.11%**, Macro F1 **85.64%**).
2. **Latency Inferensi:** Target $\le 10$ detik per scan (Tercapai rata-rata **40.17 ms**, single-run test $\sim 273$ ms).
3. **Uptime & Skalabilitas:** Target uptime $\ge 99\%$ pada Cloud VPS mahasiswa.
4. **Keamanan & Kepatuhan:** *Zero tolerance* kebocoran data foto wajah (sesuai UU PDP / GDPR).

---

## 2. Diagram Garis Besar Alur Kerja (End-to-End Workflow)

```
[ Pengguna di Browser (Web/HP/PC) ]
         │
         │ 1. Buka Web & Login / Registrasi Akun
         ▼
[ Modul Input Citra Wajah ]
  ├── Opsi A: Tangkapan Langsung (Webcam / Kamera HP via HTML5 MediaDevices)
  └── Opsi B: Unggah Berkas Foto Wajah (JPEG/PNG)
         │
         │ 2. Validasi File (Tipe MIME, Ukuran Max 5MB, EXIF Sanitasi)
         ▼
[ Backend API Server (FastAPI / Flask / Laravel) ]
         │
         │ 3. Kirim Citra ke AI Inference Pipeline
         ▼
[ Pipeline Pemrosesan Citra & AI Engine ]
  ├── A. Face Detection & Crop: MediaPipe Face Detection (Short-Range)
  │      └── Validasi wajah terdeteksi (Fallback jika bukan wajah manusia)
  ├── B. Prapemrosesan: CLAHE (Contrast Limited Adaptive Histogram Equalization)
  │      └── Resize ke 224x224 & Normalisasi ImageNet (Mean/Std)
  └── C. Model Inference: PyTorch / ONNX Runtime (EfficientNet-B0)
         └── Output: Probabilitas 5 Kelas (Acne, Combination, Dry, Normal, Oily)
         │
         │ 4. Skor Probabilitas & Deteksi Masalah (Pori, Kemerahan, Minyak)
         ▼
[ Rule-Based & Recommendation Engine ]
  ├── A. Pemetaan Kandungan Aktif (Active Ingredients: Niacinamide, Salicylic Acid, Ceramide, Hyaluronic Acid, dll.)
  ├── B. Pencocokan Produk Skincare (Katalog 3 Tier: Ekonomis, Menengah, Premium)
  └── C. Penyusunan Jadwal Skincare (Morning Routine & Night Routine)
         │
         │ 5. (Opsional / Fitur Premium) Skin Simulator Engine
         ▼
[ Skin Simulator (Visual Proyeksi 1, 2, 3 Minggu) ]
  └── Generasi simulasi visual reduksi kemerahan, sebum, dan lesi jerawat bertahap
         │
         │ 6. Simpan Riwayat Scan & Hasil
         ▼
[ Database (PostgreSQL / MySQL) & Storage Aman ]
  ├── Profil Pengguna & Preferensi Budget / Alergi
  ├── Log Riwayat Scan Kulit (Skin History)
  └── Enkripsi / Pseudonimisasi Path Foto
         │
         │ 7. Respons JSON Terstruktur
         ▼
[ Antarmuka Web Pengguna (Frontend: React / Next.js / Tailwind CSS) ]
  ├── Tampilan Dashboard Kondisi Kulit & Tingkat Keyakinan (Confidence Score)
  ├── Rekomendasi Kandungan & Produk 3-Tier
  ├── Jadwal Rutinitas Pagi & Malam
  └── Visualisasi Progress Timeline & Simulator
```

---

## 3. Rincian Alur Setiap Modul (System Modules)

### Modul 1: Antarmuka Web & Akuisisi Data Wajah (Frontend Web)
- **Komponen:** React.js / Next.js / Tailwind CSS dengan HTML5 Camera API.
- **Mekanisme:**
  - Pengguna menyetujui *Consent & Disclaimer Medis* sebelum pengambilan gambar (edukasi bahwa sistem adalah *skincare companion*, bukan diagnosis klinis Sp.KK).
  - Mengambil foto wajah depan (*front-facing*) dengan pencahayaan cukup atau mengunggah berkas citra.
  - Kompresi sisi klien (*client-side compression*) sebelum upload untuk efisiensi *bandwidth*.

### Modul 2: Prapemrosesan & Inferensi AI (Core Vision Service)
Sesuai implementasi pada notebook dan konfigurasi `class_mapping.json`:
1. **Face Detection:** Menggunakan `MediaPipe Short-Range Detector` untuk mendeteksi koordinat wajah dan memotong (*crop*) area wajah utama dengan *margin*. Menolak citra jika wajah tidak terdeteksi.
2. **Kompensasi Pencahayaan (CLAHE):** Menggunakan *Contrast Limited Adaptive Histogram Equalization* (`clip_limit: 2.0`, `tile_grid_size: [8, 8]`) pada kanal L (ruang warna LAB) agar tekstur kulit, kilap minyak, dan pori terlihat konsisten di berbagai kondisi cahaya.
3. **Standarisasi Input:** Resize resolusi ke $224 \times 224$ piksel dan normalisasi standar ImageNet.
4. **Inferensi Model:** 
   - Model Produksi: **EfficientNet-B0** (format PyTorch `.pt` atau ONNX `.onnx` via ONNX Runtime).
   - Klasifikasi 5 kelas: `acne`, `combination`, `dry`, `normal`, `oily`.
   - Menghasilkan probabilitas *confidence score* per kelas.

### Modul 3: Engine Rekomendasi Kandungan & Produk Skincare
- **Pencocokan Bahan Aktif (*Ingredient Matching*):**
  - **Oily / Acne:** Salicylic Acid (BHA), Niacinamide, Tea Tree, Centella Asiatica, Zinc PCA.
  - **Dry:** Hyaluronic Acid, Ceramide, Glycerin, Squalane, Shea Butter.
  - **Combination:** Hyaluronic Acid (area kering), Niacinamide ringan (T-zone), Centella Asiatica.
  - **Normal:** Antioxidant (Vitamin C), Panthenol, Hyaluronic Acid ringan, Sunscreen SPF 30/50.
- **Filter 3 Tier Budget:**
  - **Tier Ekonomis:** Brand lokal terjangkau (misal: Emina, Wardah, Hanasui, Viva).
  - **Tier Menengah:** Brand populer mid-range (misal: Somethinc, Skintific, COSRX, The Originote).
  - **Tier Premium:** Skincare dermatologi / internasional (misal: La Roche-Posay, Kiehl's, Paula's Choice).
- **Rekomendasi Rutinitas:** Format *AM Routine* (Cleanser, Toner/Serum, Moisturizer, Sunscreen) dan *PM Routine* (Double Cleansing, Treatment/Serum, Barrier Cream).

### Modul 4: Skin Simulator (Fitur Proyeksi Hasil Perawatan)
- Memetakan tingkat keparahan masalah awal (*baseline*).
- Menghasilkan representasi visual prediksi perbaikan kulit secara bertahap pada **Minggu ke-1**, **Minggu ke-2**, dan **Minggu ke-3** jika rutinitas dipatuhi.
- Mengurangi intensitas saturasi kemerahan dan *blurring noise/blemish* secara terukur untuk visualisasi edukatif.

### Modul 5: Riwayat Pengguna & Manajemen Akun (Skin History & Profile)
- Penyimpanan data scan historis untuk memantau grafik perkembangan kondisi kulit dari waktu ke waktu (mingguan/bulanan).
- Profil mencakup catatan preferensi anggaran pengguna dan riwayat alergi terhadap kandungan tertentu (otomatis mengecualikan produk yang mengandung alergen tersebut).

---

## 4. Arsitektur Teknis & Spesifikasi Infrastruktur

| Lapisan Sistem | Teknologi / Pilihan Stack | Fungsi Utama |
|---|---|---|
| **Client / Frontend** | React.js / Next.js / Tailwind CSS | UI responsif (Mobile & Desktop browser), WebRTC/Webcam scanner, visualisasi grafik |
| **API Gateway & Backend** | FastAPI / Flask / Laravel REST API | Auth (JWT), validasi input, orkestrasi pipeline, rate limiting, routing data |
| **Inference Engine** | ONNX Runtime / PyTorch (CPU-optimized) | Eksekusi model EfficientNet-B0 bobot ringan (~17 MB) dengan latensi < 50 ms |
| **Computer Vision Preproc**| MediaPipe + OpenCV (CLAHE) | Deteksi wajah, crop, perataan kontras tekstur kulit |
| **Database** | PostgreSQL / MySQL | Relasi data pengguna, log analisis, katalog produk skincare, preferensi alergi |
| **Penyimpanan Berkas** | Local Storage terenkripsi / Private Object Storage | Foto scan wajah diproteksi token & dibersihkan berkala sesuai kebijakan privasi |
| **Infrastruktur Hosting** | Cloud VPS Mahasiswa + Domain (.my.id/.com) | Biaya hemat (alokasi anggaran Rp 750.000 sesuai Charter), Nginx Reverse Proxy, SSL HTTPS |

---

## 5. Tata Kelola Privasi, Kualitas, & Kepatuhan (Compliance)

1. **Kepatuhan UU PDP (Data Privacy):**
   - Foto wajah pengguna tidak disebarluaskan dan tidak diindeks publik.
   - Opsi bagi pengguna untuk menghapus foto atau riwayat analisis kapan saja (*right to be forgotten*).
   - Seluruh transmisi data diwajibkan melewati jalur terenkripsi HTTPS (TLS 1.3).
2. **Penanganan Batasan Sistem (Disclaimer Medis):**
   - Menampilkan notifikasi eksplisit bahwa sistem berfungsi sebagai *personal guide/recommender*, bukan diagnosis resmi penyakit kulit klinis atau pengganti resep dokter spesialis dermatologi.
3. **Standar Kualitas & Mitigasi Risiko:**
   - **ISO/IEC 25010** untuk kualitas fungsionalitas dan keandalan.
   - **OWASP Top 10** untuk sanitasi payload, proteksi injection, dan keamanan autentikasi.
   - Validasi fallback jika wajah tidak menghadap lurus atau pencahayaan terlalu gelap.

---

## 6. Ringkasan Status Proyek Saat Ini

- **Dataset & Curation:** Berhasil dikurasi dan dibersihkan (`clean_manifest.csv`, `split_manifest.csv`).
- **Model Training:** Selesai dilatih dan dievaluasi; model terbaik adalah **EfficientNet-B0** dengan akurasi **85.11%** (memenuhi target KPI Project Charter $\ge 85\%$).
- **Checkpoint Model Siap Pakai:**
  - `models/checkpoints/best_dermamate_skin_model.onnx` (17.3 MB) — Siap untuk *lightweight production inference* di web server.
  - `models/checkpoints/best_dermamate_skin_model.pt` (17.6 MB).
  - `models/checkpoints/class_mapping.json` (Konfigurasi prapemrosesan & mapping 5 kelas).
- **Langkah Pengembangan Berikutnya:** Integrasi REST API Backend (`/api/v1/scan`, `/api/v1/recommendations`) dan penyusunan frontend antarmuka pengguna web.
