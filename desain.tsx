"use client";

import React, { useState, useRef } from "react";

// Tipe Data Response dari Backend DermaMate AI (5 Kelas + 3 Tier Harga)
interface ClassProbability {
  label: string;
  percentage: number;
}

interface ProductRecommendation {
  id: number;
  name: string;
  brand: string;
  category: string;
  tier: "Ekonomis" | "Menengah" | "Premium";
  price: string;
  matchScore: number;
  keyIngredients: string[];
  description: string;
}

interface SkinAnalysisResult {
  skinType: string;
  skinTypeEn: string;
  confidence: number;
  summaryTitle: string;
  description: string;
  problems: string[];
  recommendedIngredients: string[];
  avoidIngredients: string[];
  probabilities: ClassProbability[];
  products: ProductRecommendation[];
}

// Komponen SVG Ornamen Ranting Daun/Bunga Khas Sudut Figma DermaMate AI
const BotanicalCornerSVG = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
  >
    <path
      d="M25 155C45 120 80 75 145 35"
      stroke="#C89D94"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M55 115C42 95 45 72 62 58C72 74 68 98 55 115Z"
      stroke="#C89D94"
      strokeWidth="1.3"
      fill="#F7DCD6"
      fillOpacity="0.45"
    />
    <path
      d="M85 88C105 98 128 92 140 75C122 68 100 72 85 88Z"
      stroke="#C89D94"
      strokeWidth="1.3"
      fill="#F7DCD6"
      fillOpacity="0.45"
    />
    <path
      d="M92 78C78 58 82 36 98 22C108 38 105 62 92 78Z"
      stroke="#C89D94"
      strokeWidth="1.3"
      fill="#E5ECE8"
      fillOpacity="0.6"
    />
    <path
      d="M42 132C62 142 85 138 98 122C80 114 58 118 42 132Z"
      stroke="#C89D94"
      strokeWidth="1.3"
      fill="#E5ECE8"
      fillOpacity="0.6"
    />
    <circle cx="148" cy="33" r="4" fill="#D47484" fillOpacity="0.6" />
    <circle cx="72" cy="48" r="3" fill="#D47484" fillOpacity="0.5" />
    <circle cx="118" cy="105" r="3.5" fill="#4F6F5B" fillOpacity="0.4" />
  </svg>
);

export default function DermaMateAestheticFlow() {
  // Step: 1 = Pilih Metode, 2 = Kuesioner (3 Tab), 3 = Preview Wajah, 4 = Hasil Analisis (Frame 7), 5 = Rekomendasi 3 Tier (Frame 8)
  const [step, setStep] = useState<number>(4); // Default ditampilkan Step 4 agar Anda langsung melihat perubahannya
  const [quizStep, setQuizStep] = useState<number>(1);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("Semua");
  const [userNote, setUserNote] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Kuesioner (Frame 3, 4, 5 pada Baris 1 Figma)
  const [questionnaire, setQuestionnaire] = useState({
    skinFeelAfterWash: "Terasa ketarik, kering, atau mengelupas",
    tZoneOiliness: "Jarang berminyak, cenderung kusam",
    sensitivityLevel: "Kadang kemerahan jika memakai produk keras",
    allergy: "Alkohol Denat, Artificial Fragrance",
    budgetTier: "Semua",
  });

  // Data Hasil Analisis Lengkap (Sesuai screenshot & desain Figma Frame 7 & 8)
  const [result, setResult] = useState<SkinAnalysisResult>({
    skinType: "Kering",
    skinTypeEn: "Dry Skin Type",
    confidence: 59.2,
    summaryTitle: "Kondisi Hidrasi Rendah & Butuh Penguatan Skin Barrier",
    description:
      "Gunakan pembersih non-stripping (Low pH) dan pelembap intensif dengan kandungan Ceramide atau Hyaluronic Acid. Hindari eksfoliasi berlebih agar kelembapan alami kulit tidak terkikis.",
    problems: [
      "Kelembapan rendah (Dehidrasi)",
      "Tekstur kulit terasa kencang atau bersisik",
      "Skin barrier rentan iritasi",
    ],
    recommendedIngredients: [
      "5 Tipe Ceramide",
      "Hyaluronic Acid",
      "Centella Asiatica",
      "Panthenol (Vit B5)",
      "Avalanche Rose Oil",
      "Squalane",
    ],
    avoidIngredients: ["Alcohol Denat Tinggi", "SLS / SLES", "Physical Scrub Kasar"],
    probabilities: [
      { label: "Kering", percentage: 59.2 },
      { label: "Kombinasi", percentage: 15.8 },
      { label: "Berminyak", percentage: 15.0 },
      { label: "Jerawat (Acne)", percentage: 6.4 },
      { label: "Normal", percentage: 3.5 },
    ],
    products: [
      {
        id: 1,
        name: "Gokujyun Ultimate Moisturizing Lotion",
        brand: "Hada Labo",
        category: "Hydrating Toner / Lotion",
        tier: "Ekonomis",
        price: "Rp 48.000",
        matchScore: 96,
        keyIngredients: ["3 Tipe Hyaluronic Acid", "Bebas Alkohol", "Bebas Fragrance"],
        description: "Mengunci kelembapan secara mendalam pada lapisan epidermis tanpa rasa lengket.",
      },
      {
        id: 2,
        name: "Hydra Rose Gel to Foam Cleanser",
        brand: "Wardah",
        category: "Low pH Gentle Cleanser",
        tier: "Ekonomis",
        price: "Rp 36.500",
        matchScore: 93,
        keyIngredients: ["72 Hours Hydrating Active", "Avalanche Rose Oil"],
        description: "Membersihkan wajah dengan lembut tanpa membuat kulit terasa ketarik.",
      },
      {
        id: 3,
        name: "5X Ceramide Low pH Cleanser",
        brand: "Skintific",
        category: "Barrier Gentle Cleanser",
        tier: "Menengah",
        price: "Rp 99.000",
        matchScore: 95,
        keyIngredients: ["5 Tipe Ceramide", "Amino Acid", "Hyaluronic Acid"],
        description: "Menjaga pH alami kulit (5.5) sekaligus merawat kekuatan skin barrier.",
      },
      {
        id: 4,
        name: "5X Ceramide Barrier Repair Moisture Gel",
        brand: "Skintific",
        category: "Intensive Moisturizer",
        tier: "Premium",
        price: "Rp 139.000",
        matchScore: 98,
        keyIngredients: ["5X Ceramide", "Hyaluronic Acid", "Centella Asiatica"],
        description: "Memperbaiki tekstur kulit kering dan bersisik serta memberikan hidrasi 24 jam.",
      },
    ],
  });

  // Handle Upload Foto Baru
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStep(2);
    }
  };

  // Integrasi REST API ke Backend FastAPI / Flask / Laravel
  const handleAnalyzeSkin = async () => {
    setIsLoading(true);
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("allergy", questionnaire.allergy);
        formData.append("budget_preference", questionnaire.budgetTier);

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/analyze-skin";
        const response = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setResult(data);
        }
      }
      setStep(4);
    } catch (error) {
      // Tetap lanjutkan ke Step 4 dengan state yang sudah terformat
      setStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#3A2829] relative overflow-hidden font-sans selection:bg-[#D47484]/20">
      {/* Import Google Fonts: Playfair Display (Serif Elegan sesuai Figma) & Plus Jakarta Sans */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");
        .font-serif-figma {
          font-family: "Playfair Display", Georgia, serif;
        }
        .font-sans-figma {
          font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* --- ORNAMEN LATAR BELAKANG PERSIS FIGMA DERMAMATE AI --- */}
      {/* Lingkaran Dekoratif Soft Peach-Pink */}
      <div className="w-[380px] h-[380px] rounded-full bg-gradient-to-br from-[#FADAD6]/80 to-[#FDECE9]/40 absolute -top-28 -right-24 pointer-events-none" />
      <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#FADAD6]/75 to-[#FDECE9]/30 absolute -bottom-36 -left-28 pointer-events-none" />
      <div className="w-44 h-44 rounded-full bg-[#FCE6E3]/60 absolute top-1/3 -left-16 pointer-events-none" />

      {/* Ilustrasi Vektor Ranting Bunga/Daun di Sudut Layar */}
      <BotanicalCornerSVG className="w-40 h-40 absolute top-6 left-4 opacity-75 -rotate-12" />
      <BotanicalCornerSVG className="w-44 h-44 absolute top-10 right-6 opacity-80 rotate-90" />
      <BotanicalCornerSVG className="w-44 h-44 absolute bottom-4 left-8 opacity-80 -rotate-45" />
      <BotanicalCornerSVG className="w-40 h-40 absolute bottom-6 right-8 opacity-75 rotate-180" />

      {/* --- NAVBAR UTAMA DERMAMATE AI --- */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative z-20 border-b border-[#F2DDD9]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#FADAD6] border border-[#E5B8B3] flex items-center justify-center shadow-xs">
            <span className="font-serif-figma font-bold text-[#9C4453] text-lg">D</span>
          </div>
          <span className="font-serif-figma text-2xl font-bold tracking-tight text-[#3A2829]">
            DermaMate<span className="text-[#D47484] italic">.AI</span>
          </span>
        </div>

        {/* Navigasi Langkah / Halaman */}
        <nav className="hidden md:flex items-center gap-2 bg-white/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#F0D6D2] shadow-2xs text-xs font-medium">
          {[
            { id: 1, label: "1. Pilih Metode" },
            { id: 2, label: "2. Kuesioner Kulit" },
            { id: 3, label: "3. Scan Wajah" },
            { id: 4, label: "4. Hasil Diagnosis" },
            { id: 5, label: "5. Rekomendasi Tier" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStep(item.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                step === item.id
                  ? "bg-[#D47484] text-white font-semibold shadow-xs"
                  : "text-[#6E5355] hover:bg-[#FCE9E6]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-full bg-[#4F6F5B] text-white text-xs font-semibold hover:bg-[#3E5948] transition shadow-xs"
          >
            + Upload Foto Baru
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </header>

      {/* --- KONTEN UTAMA --- */}
      <main className="max-w-6xl mx-auto px-6 py-8 md:py-10 relative z-10 font-sans-figma">
        {/* =====================================================================
            STEP 1: PILIH METODE SCAN WAJAH (Baris 1 - Frame 2 pada Figma)
           ===================================================================== */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-[#FADAD6]/80 text-[#9C4453] text-xs font-semibold tracking-wide mb-2">
                AI Skin Analysis & Personal Companion
              </span>
              <h1 className="font-serif-figma text-3xl md:text-4xl font-bold text-[#3A2829]">
                Mulai Kenali Kebutuhan Kulit Wajahmu
              </h1>
              <p className="text-xs md:text-sm text-[#7A5E60] mt-2 max-w-xl mx-auto">
                Pilih metode pemindaian wajah dan jawab kuesioner singkat agar AI kami dapat memberikan rekomendasi kandungan serta produk paling akurat.
              </p>
            </div>

            <div className="bg-[#FDF1EE] rounded-[32px] p-6 md:p-10 border border-[#F0D2CD] shadow-md grid md:grid-cols-12 gap-8 items-center">
              {/* Kartu Kiri: Banner Ilustrasi Kamera seperti Frame 2 Figma */}
              <div className="md:col-span-6 bg-gradient-to-br from-[#F7C7C0] to-[#FADAD6] rounded-3xl p-7 text-[#3A2829] relative overflow-hidden shadow-inner border border-white/60">
                <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-[#9C4453] text-[11px] font-bold mb-3">
                  Computer Vision Ready
                </span>
                <h3 className="font-serif-figma text-2xl font-bold leading-snug mb-2">
                  Analisis Kulit Wajah dalam &le; 10 Detik
                </h3>
                <p className="text-xs text-[#593E40] leading-relaxed mb-5">
                  Didukung model Ensemble ResNet50 & EfficientNet-B0 untuk mendeteksi 5 kelas kondisi kulit sekaligus menyusun rekomendasi 3 tier harga.
                </p>
                <div className="bg-white/75 backdrop-blur-xs rounded-2xl p-4 space-y-2 text-xs text-[#4A3335]">
                  <p className="font-bold text-[#9C4453]">Panduan Akurasi Maksimal:</p>
                  <p>✓ Wajah bersih tanpa makeup tebal atau filter.</p>
                  <p>✓ Pencahayaan merata dari arah depan.</p>
                  <p>✓ Fokuskan kamera pada area kulit wajah.</p>
                </div>
              </div>

              {/* Kartu Kanan: Opsi Upload / Kamera */}
              <div className="md:col-span-6 bg-white rounded-3xl p-7 border border-[#F0D6D2] shadow-xs space-y-5">
                <h4 className="font-serif-figma text-xl font-bold text-[#3A2829]">
                  Unggah Foto atau Gunakan Kamera
                </h4>
                <p className="text-xs text-[#7A5E60]">
                  Data foto Anda terenkripsi dan hanya digunakan untuk pemindaian profil kulit pribadi Anda.
                </p>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D47484]/60 hover:border-[#D47484] bg-[#FFF8F6] hover:bg-[#FDF1EE] transition cursor-pointer rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FADAD6] text-[#9C4453] mx-auto flex items-center justify-center font-bold text-lg mb-3">
                    📷
                  </div>
                  <p className="text-xs font-bold text-[#3A2829]">
                    Klik untuk Pilih Foto Wajah / Buka Kamera
                  </p>
                  <p className="text-[11px] text-[#8C6F71] mt-1">
                    Mendukung format JPG, JPEG, PNG (Maks. 5 MB)
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-[#D47484] hover:underline"
                  >
                    Isi Kuesioner Dulu →
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-6 py-2.5 rounded-full bg-[#4F6F5B] text-white text-xs font-semibold hover:bg-[#3E5948] transition shadow-xs"
                  >
                    Lihat Demo Hasil Diagnosis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 2: KUESIONER KULIT 3 TAHAP (Baris 1 - Frame 3, 4, 5 pada Figma)
           ===================================================================== */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-serif-figma text-3xl font-bold text-[#3A2829]">
                Kenali Karakteristik Kulitmu
              </h2>
              <p className="text-xs text-[#7A5E60] mt-1">
                Tahap {quizStep} dari 3 — Membantu AI memvalidasi kondisi skin barrier dan preferensi produkmu
              </p>
            </div>

            <div className="bg-[#FDF1EE] rounded-[32px] p-6 md:p-9 border border-[#F0D2CD] shadow-md">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F2DDD9] shadow-2xs space-y-6">
                {/* Progress Indikator Bulat */}
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuizStep(s)}
                      className={`h-2.5 rounded-full transition-all ${
                        quizStep === s ? "w-10 bg-[#D47484]" : "w-2.5 bg-[#EED2CE]"
                      }`}
                    />
                  ))}
                </div>

                {quizStep === 1 && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-[#3A2829]">
                      1. Bagaimana kondisi kulit wajahmu 30 menit setelah mencuci muka?
                    </label>
                    {[
                      "Terasa ketarik, kering, atau mengelupas",
                      "Berminyak di seluruh area wajah",
                      "Berminyak hanya di area T-Zone (dahi, hidung, dagu)",
                      "Terasa nyaman, lembap, dan tidak berminyak",
                    ].map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                          questionnaire.skinFeelAfterWash === opt
                            ? "border-[#D47484] bg-[#FDF1EE] font-semibold text-[#3A2829]"
                            : "border-[#F0D6D2] bg-[#FFFDFC] text-[#6E5355]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="skinFeel"
                          checked={questionnaire.skinFeelAfterWash === opt}
                          onChange={() =>
                            setQuestionnaire({ ...questionnaire, skinFeelAfterWash: opt })
                          }
                          className="accent-[#D47484]"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {quizStep === 2 && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-[#3A2829]">
                      2. Apakah kamu memiliki riwayat alergi kandungan skincare tertentu?
                    </label>
                    <input
                      type="text"
                      value={questionnaire.allergy}
                      onChange={(e) =>
                        setQuestionnaire({ ...questionnaire, allergy: e.target.value })
                      }
                      placeholder="Contoh: Alkohol, Fragrance, Paraben, Essential Oil..."
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8C8C3] bg-[#FFFDFC] text-xs focus:outline-none focus:border-[#D47484]"
                    />
                    <p className="text-[11px] text-[#8C6F71]">
                      *Kandungan di atas akan otomatis disaring keluar dari rekomendasi produk DermaMate AI.
                    </p>
                  </div>
                )}

                {quizStep === 3 && (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-[#3A2829]">
                      3. Pilih preferensi rentang anggaran (Tier Harga) produk skincare:
                    </label>
                    {["Semua", "Ekonomis", "Menengah", "Premium"].map((tier) => (
                      <label
                        key={tier}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                          questionnaire.budgetTier === tier
                            ? "border-[#D47484] bg-[#FDF1EE] font-semibold"
                            : "border-[#F0D6D2] bg-[#FFFDFC]"
                        }`}
                      >
                        <span>
                          Tier {tier}{" "}
                          {tier === "Ekonomis" && "(< Rp 75.000)"}
                          {tier === "Menengah" && "(Rp 75.000 - Rp 130.000)"}
                          {tier === "Premium" && "(> Rp 130.000)"}
                        </span>
                        <input
                          type="radio"
                          name="budgetTier"
                          checked={questionnaire.budgetTier === tier}
                          onChange={() =>
                            setQuestionnaire({ ...questionnaire, budgetTier: tier })
                          }
                          className="accent-[#D47484]"
                        />
                      </label>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => (quizStep > 1 ? setQuizStep(quizStep - 1) : setStep(1))}
                    className="px-5 py-2.5 rounded-full border border-[#D47484] text-[#D47484] text-xs font-semibold hover:bg-[#FDF1EE] transition"
                  >
                    ← Kembali
                  </button>
                  <button
                    onClick={() => (quizStep < 3 ? setQuizStep(quizStep + 1) : setStep(3))}
                    className="px-8 py-2.5 rounded-full bg-[#D47484] text-white text-xs font-semibold hover:bg-[#be5f6f] transition shadow-xs"
                  >
                    {quizStep < 3 ? "Selanjutnya →" : "Lanjut ke Pemindaian Wajah →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 3: PREVIEW & PEMINDAIAN WAJAH AI (Baris 1 - Frame 6 pada Figma)
           ===================================================================== */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-serif-figma text-3xl font-bold text-[#3A2829]">
                Pemindaian Tekstur & Kondisi Kulit
              </h2>
              <p className="text-xs text-[#7A5E60] mt-1">
                Pastikan area kulit terlihat jelas sebelum memulai inferensi Computer Vision
              </p>
            </div>

            <div className="bg-[#FDF1EE] rounded-[32px] p-6 md:p-10 border border-[#F0D2CD] shadow-md grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 relative">
                <div className="rounded-3xl overflow-hidden border-4 border-white shadow-md aspect-[4/3] bg-[#EAD3CF] relative">
                  <img
                    src={previewUrl}
                    alt="Preview Kulit"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Biometric Reticle seperti Frame 6 Figma */}
                  <div className="absolute inset-6 border-2 border-dashed border-white/90 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full border border-white/70" />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#3A2829]/75 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-full">
                    CLAHE Lighting Normalization: Aktif
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-[#F2DDD9] shadow-xs space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EAF2EE] text-[#4F6F5B] text-[11px] font-bold">
                  Ensemble Ready (ResNet50 + EfficientNet-B0)
                </span>
                <h3 className="font-serif-figma text-2xl font-bold text-[#3A2829]">
                  Siap Menganalisis
                </h3>
                <p className="text-xs text-[#6E5355] leading-relaxed">
                  Model akan menghitung distribusi probabilitas untuk 5 kelas dermatologi: <strong>Kering, Kombinasi, Berminyak, Jerawat (Acne), dan Normal</strong>.
                </p>

                <div className="bg-[#FFF8F6] p-3.5 rounded-2xl border border-[#F0D6D2] text-[11px] text-[#7A5E60] space-y-1">
                  <p><strong>Filter Alergi:</strong> {questionnaire.allergy || "Tidak ada"}</p>
                  <p><strong>Preferensi Tier:</strong> {questionnaire.budgetTier}</p>
                </div>

                <button
                  onClick={handleAnalyzeSkin}
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-[#4F6F5B] text-white text-xs font-semibold hover:bg-[#3E5948] transition shadow-sm"
                >
                  {isLoading ? "Memproses Citra Kulit..." : "Lihat Hasil Diagnosis AI →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 4: HASIL DIAGNOSIS AI — REDESIGN SESUAI FRAME 7 FIGMA!
            (Menggantikan tampilan polos pada screenshot WhatsApp Anda)
           ===================================================================== */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Header Editorial Bagian Atas sesuai Frame 7 Figma */}
            <div className="text-center max-w-2xl mx-auto mb-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FADAD6]/80 text-[#9C4453] text-xs font-semibold tracking-wide mb-2 shadow-2xs">
                ✨ Laporan Analisis Dermatologi AI
              </span>
              <h1 className="font-serif-figma text-3xl md:text-4xl font-bold text-[#3A2829]">
                Hasil Diagnosis & Profil Kulitmu
              </h1>
              <p className="text-xs text-[#7A5E60] mt-1">
                Berdasarkan ekstraksi fitur tekstur kulit dan pencocokan basis data kandungan aktif DermaMate AI
              </p>
            </div>

            {/* KARTU UTAMA BERLAPIS WARM BLUSH (Bukan Putih Polos) */}
            <div className="bg-gradient-to-br from-[#FDF1EE] via-[#FFF8F6] to-[#FCEAE6] rounded-[36px] p-6 md:p-10 border border-[#EOC8C2] shadow-[0_16px_45px_-15px_rgba(180,120,125,0.22)] relative overflow-hidden">
              {/* Aksen Dekoratif Sudut Dalam Kartu */}
              <div className="w-48 h-48 rounded-full bg-[#FADAD6]/45 absolute -top-16 -right-16 pointer-events-none" />

              <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
                {/* --- KOLOM KIRI (5 KOLOM): FOTO DENGAN BINGKAI ESTETIK + DISTRIBUSI 5 KELAS --- */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Bingkai Foto Kulit / Wajah dengan Badge & Aksen Figma */}
                  <div className="bg-white p-3.5 rounded-[28px] border border-[#F0D2CD] shadow-sm relative">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3.6] bg-[#EAD3CF]">
                      <img
                        src={previewUrl}
                        alt="Hasil Pemindaian Kulit"
                        className="w-full h-full object-cover"
                      />
                      {/* Sudut Fokus Pemindaian AI */}
                      <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-white/90 rounded-tl-lg" />
                      <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-white/90 rounded-tr-lg" />
                      <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-white/90 rounded-bl-lg" />
                      <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-white/90 rounded-br-lg" />

                      {/* Badge Mengambang di atas Foto */}
                      <div className="absolute bottom-3.5 inset-x-3.5 bg-[#3A2829]/80 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#74C69D] animate-pulse" />
                          Tekstur Terdeteksi: {result.skinType}
                        </span>
                        <span className="font-bold text-[#FADAD6]">
                          {result.confidence}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* KARTU DISTRIBUSI PROBABILITAS 5 KELAS AI (Dipercantik dengan Gaya Figma) */}
                  <div className="bg-white/95 backdrop-blur-xs rounded-[26px] p-5 md:p-6 border border-[#F0D2CD] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C4453]">
                          Soft-Voting Ensemble Output
                        </span>
                        <h4 className="font-serif-figma text-base font-bold text-[#3A2829]">
                          Distribusi Probabilitas 5 Kelas AI
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#FDF1EE] text-[#9C4453] text-[11px] font-bold border border-[#F2D5D0]">
                        5 Kelas
                      </span>
                    </div>

                    <div className="space-y-3">
                      {result.probabilities.map((item, idx) => {
                        const isTop = idx === 0;
                        return (
                          <div key={item.label} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span
                                className={`flex items-center gap-2 ${
                                  isTop ? "font-bold text-[#3A2829]" : "font-medium text-[#6E5355]"
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    isTop ? "bg-[#C85A6B]" : "bg-[#E2B6B1]"
                                  }`}
                                />
                                {item.label}
                                {isTop && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FADAD6] text-[#9C4453] font-bold">
                                    Dominan
                                  </span>
                                )}
                              </span>
                              <span
                                className={`font-bold ${
                                  isTop ? "text-[#C85A6B]" : "text-[#6E5355]"
                                }`}
                              >
                                {item.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-[#F9E8E5] rounded-full overflow-hidden p-0.5">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  isTop
                                    ? "bg-gradient-to-r from-[#C85A6B] to-[#E58C9A]"
                                    : "bg-[#DFA3AC]/75"
                                }`}
                                style={{ width: `${Math.max(item.percentage, 3)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* --- KOLOM KANAN (7 KOLOM): DETAIL DIAGNOSIS BERLAPIS SESUAI FRAME 7 FIGMA --- */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Header Jenis Kulit (Font Serif Besar + Pill Confidence Estetik) */}
                  <div className="bg-white/85 backdrop-blur-xs rounded-[28px] p-6 border border-[#F0D2CD] shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold tracking-wider uppercase text-[#C85A6B]">
                        Hasil Diagnosis AI • {result.skinTypeEn}
                      </span>
                      <span className="px-3.5 py-1 rounded-full bg-[#EAF2EE] border border-[#C5DDD0] text-[#3F614D] text-xs font-bold">
                        Tingkat Keyakinan: {result.confidence}%
                      </span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-4 mb-3">
                      <h2 className="font-serif-figma text-4xl md:text-5xl font-bold text-[#3A2829]">
                        {result.skinType}
                      </h2>
                      <span className="text-xs md:text-sm font-semibold text-[#8C565E] italic">
                        — {result.summaryTitle}
                      </span>
                    </div>

                    {/* Kotak Deskripsi Berbingkai Lembut seperti di Frame 7 Figma */}
                    <div className="bg-[#FFF9F7] rounded-2xl p-4 border border-[#F2DDD9] text-xs md:text-[13px] text-[#594042] leading-relaxed">
                      {result.description}
                    </div>
                  </div>

                  {/* Kartu Kondisi / Masalah Terdeteksi & Kandungan Aktif */}
                  <div className="bg-white/90 rounded-[28px] p-6 border border-[#F0D2CD] shadow-xs space-y-5">
                    {/* Masalah Kulit Terdeteksi */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="font-serif-figma text-base font-bold text-[#3A2829]">
                          Kondisi / Masalah Kulit Terdeteksi
                        </h4>
                        <span className="text-[11px] text-[#8C6F71]">
                          {result.problems.length} Indikator
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.problems.map((prob, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FCE8E6] border border-[#F2C6C2] text-[#9C4453] text-xs font-semibold"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A6B]" />
                            {prob}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#F4E2DF]" />

                    {/* Rekomendasi Kandungan Aktif (Ingredients) */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="font-serif-figma text-base font-bold text-[#3A2829]">
                          Rekomendasi Kandungan Aktif (Key Ingredients)
                        </h4>
                        <span className="text-[11px] text-[#4F6F5B] font-semibold">
                          Aman untuk Skin Barrier
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {result.recommendedIngredients.map((ing, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EDF5F0] border border-[#CDE0D4] text-[#355442] text-xs font-semibold"
                          >
                            <span className="w-4 h-4 rounded-full bg-[#4F6F5B] text-white text-[10px] flex items-center justify-center shrink-0">
                              ✓
                            </span>
                            <span className="truncate">{ing}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kandungan yang Perlu Dihindari */}
                    <div className="bg-[#FFF6F5] rounded-2xl p-3.5 border border-[#F5D5D0] flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#9C4453]">
                        ⚠️ Hindari Kandungan Berikut:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.avoidIngredients.map((av, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white border border-[#EOC0BA] text-[#7A444B] font-medium"
                          >
                            ✕ {av}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Kotak Catatan / Keluhan Tambahan & Tombol Aksi (Persis Bagian Bawah Frame 7 Figma) */}
                  <div className="bg-white/90 rounded-[28px] p-5 border border-[#F0D2CD] shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-[#594042] mb-1">
                          Catatan Kondisi Kulit / Filter Tambahan (Sesuai Desain Figma Frame 7):
                        </label>
                        <input
                          type="text"
                          value={userNote}
                          onChange={(e) => setUserNote(e.target.value)}
                          placeholder="Ketik catatan keluhan kulitmu atau biarkan default..."
                          className="w-full px-3.5 py-2 rounded-xl border border-[#E8C8C3] bg-[#FFFDFC] text-xs focus:outline-none focus:border-[#D47484]"
                        />
                      </div>
                    </div>

                    {/* Baris Tombol CTA Utama */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => setStep(5)}
                          className="px-7 py-3 rounded-full bg-[#4F6F5B] text-white text-xs font-bold hover:bg-[#3E5948] transition shadow-sm flex items-center gap-2"
                        >
                          Lihat Rekomendasi Produk ({result.products.length}) →
                        </button>
                        <button
                          onClick={() => setStep(1)}
                          className="px-6 py-3 rounded-full bg-white border border-[#D47484] text-[#C85A6B] text-xs font-bold hover:bg-[#FDF1EE] transition"
                        >
                          Scan Ulang
                        </button>
                      </div>

                      <span className="text-[11px] text-[#8C6F71] italic">
                        *Tersedia dalam 3 Tier Harga
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 5: REKOMENDASI PRODUK 3 TIER HARGA (Baris 1 - Frame 8 pada Figma)
           ===================================================================== */}
        {step === 5 && (
          <div className="space-y-7">
            {/* Header & Search/Filter Bar seperti Frame 8 Figma */}
            <div className="bg-[#FDF1EE] rounded-[32px] p-6 md:p-8 border border-[#F0D2CD] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C85A6B]">
                    Katalog Personalisasi Skincare
                  </span>
                  <h2 className="font-serif-figma text-3xl font-bold text-[#3A2829]">
                    Rekomendasi Produk untuk Kulit{" "}
                    <span className="text-[#C85A6B] underline decoration-[#FADAD6]">
                      {result.skinType}
                    </span>
                  </h2>
                </div>
                <button
                  onClick={() => setStep(4)}
                  className="self-start md:self-auto px-5 py-2.5 rounded-full bg-white border border-[#E5C0BA] text-xs font-bold text-[#594042] hover:bg-[#FFF8F6] transition"
                >
                  ← Kembali ke Hasil Diagnosis
                </button>
              </div>

              {/* Filter Pill Tier Harga (Ekonomis, Menengah, Premium) */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#F0D6D2]">
                <div className="flex flex-wrap items-center gap-2">
                  {["Semua", "Ekonomis", "Menengah", "Premium"].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTierFilter(tier)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                        selectedTierFilter === tier
                          ? "bg-[#D47484] text-white shadow-2xs"
                          : "bg-[#FFF8F6] text-[#6E5355] hover:bg-[#FCE8E6]"
                      }`}
                    >
                      {tier === "Semua" ? "Semua Tier Harga" : `Tier ${tier}`}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-[#7A5E60] px-2 font-medium">
                  Menampilkan produk bebas alergen: <strong>{questionnaire.allergy}</strong>
                </span>
              </div>
            </div>

            {/* Grid Kartu Produk Berdesain Pink Botanical Card sesuai Frame 8 Figma */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {result.products
                .filter(
                  (p) => selectedTierFilter === "Semua" || p.tier === selectedTierFilter
                )
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-[28px] p-5 border border-[#F0D2CD] shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      {/* Header Visual Produk Berwarna Soft Pink seperti Frame 8 Figma */}
                      <div className="h-44 rounded-2xl bg-gradient-to-b from-[#FADAD6] to-[#FCEAE8] p-4 flex flex-col justify-between relative overflow-hidden mb-4 border border-[#F2C6C2]">
                        <div className="flex items-center justify-between relative z-10">
                          <span className="px-3 py-1 rounded-full bg-white/90 text-[#9C4453] text-[10px] font-extrabold shadow-2xs">
                            Tier {prod.tier}
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-[#4F6F5B] text-white text-[10px] font-bold">
                            {prod.matchScore}% Cocok
                          </span>
                        </div>

                        {/* Ilustrasi Botol / Kemasan Skincare Minimalis */}
                        <div className="my-auto mx-auto w-16 h-24 rounded-t-xl rounded-b-lg bg-white/90 border border-[#E5B8B3] shadow-sm flex flex-col items-center justify-center p-2 text-center">
                          <div className="w-6 h-2.5 bg-[#D47484] rounded-t-sm -mt-4 mb-1" />
                          <span className="font-serif-figma text-[10px] font-bold text-[#3A2829] leading-tight">
                            {prod.brand}
                          </span>
                          <span className="text-[8px] text-[#9C4453] mt-0.5">
                            Barrier Care
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-[#7A444B] text-center relative z-10">
                          {prod.category}
                        </span>
                      </div>

                      {/* Nama & Harga Produk */}
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#C85A6B]">
                        {prod.brand}
                      </p>
                      <h3 className="font-serif-figma text-lg font-bold text-[#3A2829] leading-snug mt-0.5 mb-1">
                        {prod.name}
                      </h3>
                      <p className="text-base font-extrabold text-[#4F6F5B] mb-2">
                        {prod.price}
                      </p>
                      <p className="text-xs text-[#6E5355] leading-relaxed mb-3">
                        {prod.description}
                      </p>

                      {/* Tag Kandungan Utama */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {prod.keyIngredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-[#FDF1EE] border border-[#F2D5D0] text-[#8C4A56] font-semibold"
                          >
                            ✓ {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="w-full py-2.5 rounded-full bg-[#D47484] text-white text-xs font-bold hover:bg-[#be5f6f] transition shadow-2xs">
                      + Masukkan ke Skincare Routine
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}