"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  keyIngredients: string[];
  routineTime?: string;
  description: string;
  imageUrl: string;
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

// Komponen SVG Ornamen Ranting Daun/Bunga Sudut Figma DermaMate AI
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
  const router = useRouter();

  // Step: 0 = Beranda, 1 = Pilih Metode (Kamera/Upload), 2 = Kuesioner 3 Tahap, 3 = Preview & Scan, 4 = Hasil Diagnosis, 5 = Rekomendasi Produk
  const [step, setStep] = useState<number>(0);
  const [quizStep, setQuizStep] = useState<number>(1);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("Semua");
  const [userNote, setUserNote] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State khusus untuk Live Camera (Webcam)
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Kuesioner 3 Tahap
  const [questionnaire, setQuestionnaire] = useState({
    skinFeelAfterWash: "Terasa nyaman, lembap, dan tidak berminyak",
    allergy: "",
    budgetTier: "Semua",
  });

  const [result, setResult] = useState<SkinAnalysisResult | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    return () => {
      stopCamera();
    };
  }, []);

  // Fungsi Sign Out
  const handleSignOut = async () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin keluar (Sign Out)?");
    if (!confirmed) return;

    stopCamera();
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Tetap lanjut hapus token lokal
    } finally {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      router.push("/login");
    }
  };

  // Fungsi Membuka Kamera Langsung (Live Webcam)
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setIsCameraOpen(false);
      setCameraError(
        "Tidak dapat mengakses kamera. Pastikan izin kamera di browser sudah diizinkan (Allow) dan tidak sedang dipakai aplikasi lain."
      );
    }
  };

  // Fungsi Mematikan Kamera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // Fungsi Capture Foto dari Webcam
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const capturedFile = new File([blob], "webcam-scan.jpg", {
              type: "image/jpeg",
            });
            setSelectedFile(capturedFile);
            setPreviewUrl(URL.createObjectURL(capturedFile));
            stopCamera();
            setErrorMsg(null);
            setQuizStep(1);
            setStep(2);
          }
        },
        "image/jpeg",
        0.92
      );
    }
  };

  // Handle Upload File Foto
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
      setQuizStep(1);
      setStep(2);
    }
  };

  const buildProductImageUrl = (brand: string, name: string) => {
    const slug = `${brand}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return `http://127.0.0.1:8000/images/products/${slug}.svg`;
  };

  const formatClassLabel = (key: string) => {
    const map: Record<string, string> = {
      acne: "Jerawat (Acne)",
      combination: "Kombinasi",
      oily: "Berminyak",
      dry: "Kering",
      normal: "Normal",
    };
    return map[key.toLowerCase()] || key;
  };

  // Metadata tambahan untuk memperkaya tampilan kartu diagnosis Figma sesuai kelas kulit
  const getSkinMeta = (skinType: string) => {
    const metaMap: Record<
      string,
      { en: string; summary: string; avoid: string[] }
    > = {
      "Jerawat (Acne)": {
        en: "Acne-Prone Skin Type",
        summary: "Perawatan Anti-Inflamasi & Pembersihan Pori Mendalam",
        avoid: ["Comedogenic Oil", "Fragrance Kuat", "Scrub Kasar"],
      },
      Kombinasi: {
        en: "Combination Skin Type",
        summary: "Penyeimbangan Sebum T-Zone & Hidrasi Area Pipi",
        avoid: ["Alkohol Denat Tinggi", "Krim Terlalu Berat", "Sabun SLS Keras"],
      },
      Berminyak: {
        en: "Oily Skin Type",
        summary: "Kontrol Produksi Sebum & Pori-Pori Tanpa Membuat Dehidrasi",
        avoid: ["Mineral Oil Berat", "Cocoa Butter", "Pembersih Over-Drying"],
      },
      Kering: {
        en: "Dry Skin Type",
        summary: "Kondisi Hidrasi Rendah & Butuh Penguatan Skin Barrier",
        avoid: ["Alcohol Denat Tinggi", "SLS / SLES", "Physical Scrub Kasar"],
      },
      Normal: {
        en: "Normal Skin Type",
        summary: "Keseimbangan Kadar Air & Sebum Terjaga Optimal",
        avoid: ["Eksfoliasi Berlebihan", "Produk Tanpa BPOM"],
      },
    };
    return (
      metaMap[skinType] || {
        en: "Skin Profile",
        summary: "Perawatan Harian Terpersonalisasi",
        avoid: ["Alkohol Keras", "Fragrance Berlebih"],
      }
    );
  };

  // Integrasi Backend REST API Laravel (/api/skin-scans)
  const handleAnalyzeSkin = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("allergy", questionnaire.allergy);
      formData.append("budget_preference", questionnaire.budgetTier);

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/skin-scans";

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        if (response.status === 401) {
          throw new Error(
            "Sesi login habis atau belum login. Silakan login terlebih dahulu."
          );
        }
        throw new Error(resJson.message || "Gagal memproses analisis kulit.");
      }

      const scanData = resJson.data;
      const rawProducts = resJson.recommended_products || [];
      const meta = getSkinMeta(scanData.skin_type);

      const mappedProducts: ProductRecommendation[] = rawProducts.map((p: any) => ({
        id: p.id,
        name: p.product_name,
        brand: p.brand,
        category: p.category || "Skincare",
        tier: p.price_tier,
        price: `Rp ${Number(p.price_idr).toLocaleString("id-ID")}`,
        keyIngredients: p.key_ingredients
          ? p.key_ingredients.split(",").map((item: string) => item.trim())
          : [],
        routineTime: p.routine_time,
        description: p.description || "",
        imageUrl: p.image_url || buildProductImageUrl(p.brand, p.product_name),
      }));

      const uniqueIngredients = Array.from(
        new Set(mappedProducts.flatMap((p) => p.keyIngredients))
      ).slice(0, 6);

      const formattedProbs: ClassProbability[] = resJson.all_probabilities
        ? Object.entries(resJson.all_probabilities)
            .sort(([, a], [, b]) => Number(b) - Number(a))
            .map(([cls, prob]) => ({
              label: formatClassLabel(cls),
              percentage: Number((Number(prob) * 100).toFixed(1)),
            }))
        : [
            {
              label: scanData.skin_type,
              percentage: resJson.confidence
                ? Number((resJson.confidence * 100).toFixed(1))
                : 85.0,
            },
          ];

      setSelectedTierFilter(questionnaire.budgetTier || "Semua");

      setResult({
        skinType: scanData.skin_type,
        skinTypeEn: meta.en,
        confidence: resJson.confidence
          ? Number((resJson.confidence * 100).toFixed(1))
          : formattedProbs[0]?.percentage || 85.0,
        summaryTitle: meta.summary,
        description:
          scanData.recommendations ||
          "Gunakan perawatan harian sesuai tipe kulit Anda.",
        problems: scanData.skin_issues
          ? scanData.skin_issues
              .split(".")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : ["Kondisi kulit terpantau baik"],
        recommendedIngredients:
          uniqueIngredients.length > 0
            ? uniqueIngredients
            : ["Niacinamide", "Ceramide", "Hyaluronic Acid"],
        avoidIngredients: meta.avoid,
        probabilities: formattedProbs,
        products: mappedProducts,
      });

      setStep(4);
    } catch (err: any) {
      setErrorMsg(
        err.message || "Terjadi kesalahan saat menghubungi server Backend Laravel."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#3A2829] relative overflow-hidden font-sans selection:bg-[#D47484]/20">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");
        .font-serif-figma {
          font-family: "Playfair Display", Georgia, serif;
        }
        .font-sans-figma {
          font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* --- ORNAMEN LATAR BELAKANG FIGMA --- */}
      <div className="w-[380px] h-[380px] rounded-full bg-gradient-to-br from-[#FADAD6]/80 to-[#FDECE9]/40 absolute -top-28 -right-24 pointer-events-none" />
      <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#FADAD6]/75 to-[#FDECE9]/30 absolute -bottom-36 -left-28 pointer-events-none" />
      <div className="w-44 h-44 rounded-full bg-[#FCE6E3]/60 absolute top-1/3 -left-16 pointer-events-none" />

      <BotanicalCornerSVG className="w-40 h-40 absolute top-6 left-4 opacity-75 -rotate-12" />
      <BotanicalCornerSVG className="w-44 h-44 absolute top-10 right-6 opacity-80 rotate-90" />
      <BotanicalCornerSVG className="w-44 h-44 absolute bottom-4 left-8 opacity-80 -rotate-45" />
      <BotanicalCornerSVG className="w-40 h-40 absolute bottom-6 right-8 opacity-75 rotate-180" />

      {/* --- NAVBAR UTAMA --- */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 relative z-20 border-b border-[#F2DDD9]/70">
        <button
          onClick={() => {
            stopCamera();
            setStep(0);
          }}
          className="flex items-center gap-2.5 text-left"
        >
          <div className="w-9 h-9 rounded-full bg-[#FADAD6] border border-[#E5B8B3] flex items-center justify-center shadow-xs">
            <span className="font-serif-figma font-bold text-[#9C4453] text-lg">
              D
            </span>
          </div>
          <span className="font-serif-figma text-2xl font-bold tracking-tight text-[#3A2829]">
            DermaMate<span className="text-[#D47484] italic">.AI</span>
          </span>
        </button>

        {/* Navigasi Langkah & Riwayat */}
        <nav className="flex flex-wrap items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#F0D6D2] shadow-2xs text-xs font-medium font-sans-figma">
          <button
            onClick={() => {
              stopCamera();
              setStep(0);
            }}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              step === 0
                ? "bg-[#D47484] text-white font-semibold shadow-xs"
                : "text-[#6E5355] hover:bg-[#FCE9E6]"
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => {
              stopCamera();
              setStep(1);
            }}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              step >= 1 && step <= 3
                ? "bg-[#D47484] text-white font-semibold shadow-xs"
                : "text-[#6E5355] hover:bg-[#FCE9E6]"
            }`}
          >
            Scan Wajah
          </button>
          {result && (
            <>
              <button
                onClick={() => setStep(4)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  step === 4
                    ? "bg-[#D47484] text-white font-semibold shadow-xs"
                    : "text-[#6E5355] hover:bg-[#FCE9E6]"
                }`}
              >
                Hasil Diagnosis
              </button>
              <button
                onClick={() => setStep(5)}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  step === 5
                    ? "bg-[#D47484] text-white font-semibold shadow-xs"
                    : "text-[#6E5355] hover:bg-[#FCE9E6]"
                }`}
              >
                Rekomendasi
              </button>
            </>
          )}
          <a
            href="/history"
            className="px-3.5 py-1.5 rounded-full text-[#6E5355] hover:bg-[#FCE9E6] transition-all"
          >
            Skin History
          </a>
        </nav>

        {/* Tombol Kembali ke Beranda & Sign Out */}
        <div className="flex items-center gap-2.5 font-sans-figma">
          {step !== 0 && (
            <button
              onClick={() => {
                stopCamera();
                setStep(0);
              }}
              className="px-4 py-2 rounded-full bg-white text-[#3A2829] border border-[#E5B8B3] text-xs font-semibold hover:bg-[#FDF1EE] transition shadow-2xs"
            >
              ← Beranda
            </button>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition shadow-2xs"
            >
              Sign Out
            </button>
          ) : (
            <a
              href="/login"
              className="px-5 py-2 rounded-full bg-[#4F6F5B] text-white text-xs font-semibold hover:bg-[#3E5948] transition shadow-xs"
            >
              Masuk / Daftar
            </a>
          )}
        </div>
      </header>

      {/* --- KONTEN UTAMA --- */}
      <main className="max-w-6xl mx-auto px-6 py-8 md:py-10 relative z-10 font-sans-figma">
        {/* =====================================================================
            STEP 0: BERANDA / LANDING PAGE ESTETIK FIGMA
           ===================================================================== */}
        {step === 0 && (
          <div className="space-y-10 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-[#FDF1EE] via-white to-[#FCEAE6] rounded-[36px] p-8 md:p-14 border border-[#F0D2CD] shadow-[0_16px_45px_-15px_rgba(180,120,125,0.2)] text-center relative overflow-hidden">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FADAD6]/80 text-[#9C4453] text-xs font-semibold tracking-wide mb-4">
                ✨ AI Skin Analyzer &amp; Personal Skincare Companion
              </span>
              <h1 className="font-serif-figma text-3xl md:text-5xl font-bold text-[#3A2829] mb-4 leading-tight">
                Solusi Cerdas Mengenali Jenis Kulit &amp; Skincare yang Tepat
              </h1>
              <p className="text-xs md:text-sm text-[#7A5E60] mb-8 max-w-2xl mx-auto leading-relaxed">
                Deteksi 5 jenis &amp; kondisi kulit wajah (Jerawat, Kombinasi,
                Berminyak, Kering, dan Normal) menggunakan teknologi Computer
                Vision dan temukan rekomendasi produk skincare dalam 3 tier
                harga sesuai anggaran Anda.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-3.5 rounded-full bg-[#4F6F5B] text-white text-xs md:text-sm font-bold hover:bg-[#3E5948] transition shadow-sm"
                >
                  Mulai Scan Wajah Sekarang →
                </button>
                <a
                  href="/history"
                  className="px-7 py-3.5 rounded-full bg-white border border-[#D47484] text-[#9C4453] text-xs md:text-sm font-bold hover:bg-[#FDF1EE] transition"
                >
                  Lihat Riwayat Scan (Skin History)
                </a>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/95 rounded-[28px] p-6 border border-[#F0D2CD] shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#FADAD6] text-[#9C4453] font-serif-figma font-bold flex items-center justify-center text-base mb-3">
                  1
                </div>
                <h3 className="font-serif-figma font-bold text-lg text-[#3A2829] mb-1.5">
                  Analisis 5 Kelas Kulit AI
                </h3>
                <p className="text-xs text-[#7A5E60] leading-relaxed">
                  Mengklasifikasikan kondisi kulit Jerawat (Acne), Kombinasi,
                  Berminyak, Kering, atau Normal secara cepat dan terukur.
                </p>
              </div>
              <div className="bg-white/95 rounded-[28px] p-6 border border-[#F0D2CD] shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#EAF2EE] text-[#4F6F5B] font-serif-figma font-bold flex items-center justify-center text-base mb-3">
                  2
                </div>
                <h3 className="font-serif-figma font-bold text-lg text-[#3A2829] mb-1.5">
                  Filter Alergi &amp; 3 Tier Harga
                </h3>
                <p className="text-xs text-[#7A5E60] leading-relaxed">
                  Menyaring kandungan alergen secara otomatis dan mengelompokkan
                  skincare ke dalam tier Ekonomis, Menengah, serta Premium.
                </p>
              </div>
              <div className="bg-white/95 rounded-[28px] p-6 border border-[#F0D2CD] shadow-xs">
                <div className="w-10 h-10 rounded-full bg-[#FADAD6] text-[#9C4453] font-serif-figma font-bold flex items-center justify-center text-base mb-3">
                  3
                </div>
                <h3 className="font-serif-figma font-bold text-lg text-[#3A2829] mb-1.5">
                  Pantau Skin History
                </h3>
                <p className="text-xs text-[#7A5E60] leading-relaxed">
                  Menyimpan dokumentasi foto serta hasil analisis setiap
                  pemindaian untuk memantau perkembangan kulit Anda.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 1: PILIH METODE SCAN (LIVE WEBCAM & UPLOAD FILE TERPISAH)
           ===================================================================== */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 rounded-full bg-[#FADAD6]/80 text-[#9C4453] text-xs font-semibold tracking-wide mb-2">
                AI Skin Analysis &amp; Personal Companion
              </span>
              <h1 className="font-serif-figma text-3xl md:text-4xl font-bold text-[#3A2829]">
                Mulai Kenali Kebutuhan Kulit Wajahmu
              </h1>
              <p className="text-xs md:text-sm text-[#7A5E60] mt-2 max-w-xl mx-auto">
                Gunakan kamera langsung atau unggah foto wajah tanpa riasan dari
                galeri Anda untuk memulai pemindaian.
              </p>
            </div>

            {isCameraOpen ? (
              <div className="bg-[#FDF1EE] rounded-[32px] p-6 md:p-8 border border-[#F0D2CD] shadow-md max-w-md mx-auto space-y-4">
                <div className="relative rounded-3xl overflow-hidden bg-black aspect-square border-4 border-white shadow-sm">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute inset-8 border-2 border-dashed border-white/85 rounded-full pointer-events-none" />
                </div>
                <canvas ref={canvasRef} className="hidden" />

                <div className="flex justify-center gap-3">
                  <button
                    onClick={stopCamera}
                    className="px-5 py-2.5 rounded-full bg-white text-[#6E5355] border border-[#E5C0BA] text-xs font-bold hover:bg-[#FFF8F6] transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="px-7 py-2.5 rounded-full bg-[#D47484] text-white text-xs font-bold hover:bg-[#be5f6f] transition shadow-sm"
                  >
                    📸 Ambil Foto Sekarang
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#FDF1EE] rounded-[32px] p-6 md:p-10 border border-[#F0D2CD] shadow-md grid md:grid-cols-12 gap-8 items-center">
                {/* Kartu Kiri: Panduan Akurasi */}
                <div className="md:col-span-6 bg-gradient-to-br from-[#F7C7C0] to-[#FADAD6] rounded-3xl p-7 text-[#3A2829] relative overflow-hidden shadow-inner border border-white/60">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/85 text-[#9C4453] text-[11px] font-bold mb-3">
                    Computer Vision Ready
                  </span>
                  <h3 className="font-serif-figma text-2xl font-bold leading-snug mb-2">
                    Analisis Kulit Wajah dalam &le; 10 Detik
                  </h3>
                  <p className="text-xs text-[#593E40] leading-relaxed mb-5">
                    Mendeteksi 5 kelas kondisi kulit sekaligus menyusun
                    rekomendasi produk skincare yang terpersonalisasi.
                  </p>
                  <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-4 space-y-2 text-xs text-[#4A3335]">
                    <p className="font-bold text-[#9C4453]">
                      Panduan Akurasi Maksimal:
                    </p>
                    <p>✓ Wajah bersih tanpa makeup tebal atau filter.</p>
                    <p>✓ Pencahayaan merata dari arah depan.</p>
                    <p>✓ Lepaskan kacamata atau masker yang menutupi wajah.</p>
                  </div>
                </div>

                {/* Kartu Kanan: 2 Tombol Terpisah (Kamera Langsung & Upload File) */}
                <div className="md:col-span-6 bg-white rounded-3xl p-7 border border-[#F0D6D2] shadow-xs space-y-4">
                  <h4 className="font-serif-figma text-xl font-bold text-[#3A2829]">
                    Pilih Metode Pemindaian
                  </h4>
                  <p className="text-xs text-[#7A5E60]">
                    Anda dapat mengambil foto secara langsung lewat webcam/kamera
                    atau memilih file gambar dari perangkat Anda.
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="space-y-3 pt-1">
                    <button
                      onClick={startCamera}
                      className="w-full py-3.5 px-5 rounded-2xl bg-[#D47484] text-white text-xs font-bold hover:bg-[#be5f6f] transition shadow-xs flex items-center justify-center gap-2"
                    >
                      📷 Buka Kamera Langsung (Live Webcam)
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="h-px bg-[#F0D6D2] flex-1" />
                      <span className="text-[10px] font-bold uppercase text-[#8C6F71]">
                        atau
                      </span>
                      <div className="h-px bg-[#F0D6D2] flex-1" />
                    </div>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3.5 px-5 rounded-2xl bg-[#4F6F5B] text-white text-xs font-bold hover:bg-[#3E5948] transition shadow-xs flex items-center justify-center gap-2"
                    >
                      📁 Upload File Foto (JPG / PNG)
                    </button>
                  </div>

                  {cameraError && (
                    <p className="text-[11px] text-red-600 text-center bg-red-50 p-2.5 rounded-xl border border-red-200">
                      {cameraError}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  stopCamera();
                  setStep(0);
                }}
                className="text-xs font-bold text-[#7A5E60] hover:text-[#D47484] transition"
              >
                ← Kembali ke Beranda
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 2: KUESIONER KULIT 3 TAHAP (FIGMA BARIS 1 FRAME 3-5)
           ===================================================================== */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-serif-figma text-3xl font-bold text-[#3A2829]">
                Kenali Karakteristik Kulitmu
              </h2>
              <p className="text-xs text-[#7A5E60] mt-1">
                Tahap {quizStep} dari 3 — Membantu AI memvalidasi kondisi skin
                barrier dan preferensi produkmu
              </p>
            </div>

            <div className="bg-[#FDF1EE] rounded-[32px] p-6 md:p-9 border border-[#F0D2CD] shadow-md">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#F2DDD9] shadow-2xs space-y-6">
                <div className="flex items-center justify-center gap-3">
                  {[1, 2, 3].map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuizStep(s)}
                      className={`h-2.5 rounded-full transition-all ${
                        quizStep === s
                          ? "w-10 bg-[#D47484]"
                          : "w-2.5 bg-[#EED2CE]"
                      }`}
                    />
                  ))}
                </div>

                {quizStep === 1 && (
                  <div className="space-y-3.5">
                    <label className="block text-sm font-bold text-[#3A2829]">
                      1. Bagaimana kondisi kulit wajahmu 30 menit setelah mencuci
                      muka?
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
                            setQuestionnaire({
                              ...questionnaire,
                              skinFeelAfterWash: opt,
                            })
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
                      2. Apakah kamu memiliki riwayat alergi kandungan skincare
                      tertentu? (Opsional)
                    </label>
                    <input
                      type="text"
                      value={questionnaire.allergy}
                      onChange={(e) =>
                        setQuestionnaire({
                          ...questionnaire,
                          allergy: e.target.value,
                        })
                      }
                      placeholder="Contoh: Alkohol, Fragrance, Paraben, Essential Oil..."
                      className="w-full px-4 py-3 rounded-2xl border border-[#E8C8C3] bg-[#FFFDFC] text-xs focus:outline-none focus:border-[#D47484]"
                    />
                    <p className="text-[11px] text-[#8C6F71]">
                      *Kandungan di atas akan otomatis disaring keluar dari
                      rekomendasi produk DermaMate AI.
                    </p>
                  </div>
                )}

                {quizStep === 3 && (
                  <div className="space-y-3.5">
                    <label className="block text-sm font-bold text-[#3A2829]">
                      3. Pilih preferensi rentang anggaran (Tier Harga) produk
                      skincare:
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
                          {tier === "Semua"
                            ? "Tampilkan Semua Tier (Ekonomis, Menengah, Premium)"
                            : `Tier ${tier} ${
                                tier === "Ekonomis"
                                  ? "(< Rp 75.000)"
                                  : tier === "Menengah"
                                  ? "(Rp 75.000 - Rp 150.000)"
                                  : "(> Rp 150.000)"
                              }`}
                        </span>
                        <input
                          type="radio"
                          name="budgetTier"
                          checked={questionnaire.budgetTier === tier}
                          onChange={() =>
                            setQuestionnaire({
                              ...questionnaire,
                              budgetTier: tier,
                            })
                          }
                          className="accent-[#D47484]"
                        />
                      </label>
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() =>
                      quizStep > 1 ? setQuizStep(quizStep - 1) : setStep(1)
                    }
                    className="px-5 py-2.5 rounded-full border border-[#D47484] text-[#D47484] text-xs font-bold hover:bg-[#FDF1EE] transition"
                  >
                    ← {quizStep > 1 ? "Sebelumnya" : "Ganti Foto"}
                  </button>
                  <button
                    onClick={() =>
                      quizStep < 3 ? setQuizStep(quizStep + 1) : setStep(3)
                    }
                    className="px-8 py-2.5 rounded-full bg-[#D47484] text-white text-xs font-bold hover:bg-[#be5f6f] transition shadow-xs"
                  >
                    {quizStep < 3
                      ? "Selanjutnya →"
                      : "Lanjut ke Pemindaian Wajah →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 3: PREVIEW & KONFIRMASI PEMINDAIAN AI
           ===================================================================== */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-serif-figma text-3xl font-bold text-[#3A2829]">
                Pemindaian Tekstur &amp; Kondisi Kulit
              </h2>
              <p className="text-xs text-[#7A5E60] mt-1">
                Pastikan area kulit terlihat jelas sebelum memulai analisis AI
              </p>
            </div>

            <div className="bg-[#FDF1EE] rounded-[32px] p-6 md:p-10 border border-[#F0D2CD] shadow-md grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 relative">
                <div className="rounded-3xl overflow-hidden border-4 border-white shadow-md aspect-[4/3.5] bg-[#EAD3CF] relative">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview Kulit"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-6 border-2 border-dashed border-white/90 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border border-white/75" />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#3A2829]/75 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-full">
                    Siap Diproses oleh Model AI 5-Kelas
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-[#F2DDD9] shadow-xs space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#EAF2EE] text-[#4F6F5B] text-[11px] font-bold">
                  Computer Vision 5-Class Ready
                </span>
                <h3 className="font-serif-figma text-2xl font-bold text-[#3A2829]">
                  Siap Menganalisis
                </h3>
                <p className="text-xs text-[#6E5355] leading-relaxed">
                  Sistem akan menghitung probabilitas untuk 5 kelas kulit:{" "}
                  <strong>
                    Jerawat (Acne), Kombinasi, Berminyak, Kering, dan Normal
                  </strong>
                  .
                </p>

                {errorMsg && (
                  <div className="text-xs bg-red-50 text-red-700 p-3 rounded-xl border border-red-200">
                    <strong>Gagal:</strong> {errorMsg}
                  </div>
                )}

                <div className="bg-[#FFF8F6] p-3.5 rounded-2xl border border-[#F0D6D2] text-[11px] text-[#7A5E60] space-y-1">
                  <p>
                    <strong>Filter Alergi:</strong>{" "}
                    {questionnaire.allergy || "Tidak ada"}
                  </p>
                  <p>
                    <strong>Preferensi Tier:</strong> {questionnaire.budgetTier}
                  </p>
                </div>

                <button
                  onClick={handleAnalyzeSkin}
                  disabled={isLoading}
                  className="w-full py-3 rounded-full bg-[#4F6F5B] text-white text-xs font-bold hover:bg-[#3E5948] transition shadow-sm disabled:opacity-50"
                >
                  {isLoading
                    ? "Memproses Citra Kulit..."
                    : "Mulai Analisis Sekarang →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STEP 4: HASIL DIAGNOSIS AI (DESAIN EDITORIAL FIGMA FRAME 7)
           ===================================================================== */}
        {step === 4 && result && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto mb-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FADAD6]/80 text-[#9C4453] text-xs font-semibold tracking-wide mb-2 shadow-2xs">
                ✨ Laporan Analisis Dermatologi AI
              </span>
              <h1 className="font-serif-figma text-3xl md:text-4xl font-bold text-[#3A2829]">
                Hasil Diagnosis &amp; Profil Kulitmu
              </h1>
              <p className="text-xs text-[#7A5E60] mt-1">
                Berdasarkan ekstraksi fitur tekstur kulit dan pencocokan basis
                data kandungan aktif DermaMate AI
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#FDF1EE] via-[#FFF8F6] to-[#FCEAE6] rounded-[36px] p-6 md:p-10 border border-[#E0C8C2] shadow-[0_16px_45px_-15px_rgba(180,120,125,0.22)] relative overflow-hidden">
              <div className="w-48 h-48 rounded-full bg-[#FADAD6]/45 absolute -top-16 -right-16 pointer-events-none" />

              <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
                {/* KOLOM KIRI: FOTO BERBINGKAI + DISTRIBUSI PROBABILITAS 5 KELAS */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-white p-3.5 rounded-[28px] border border-[#F0D2CD] shadow-sm relative">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3.6] bg-[#EAD3CF]">
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Hasil Pemindaian Kulit"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-white/90 rounded-tl-lg" />
                      <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-white/90 rounded-tr-lg" />
                      <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-white/90 rounded-bl-lg" />
                      <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-white/90 rounded-br-lg" />

                      <div className="absolute bottom-3.5 inset-x-3.5 bg-[#3A2829]/80 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#74C69D] animate-pulse" />
                          Tekstur: {result.skinType}
                        </span>
                        <span className="font-bold text-[#FADAD6]">
                          {result.confidence}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Distribusi Probabilitas 5 Kelas AI */}
                  <div className="bg-white/95 backdrop-blur-xs rounded-[26px] p-5 md:p-6 border border-[#F0D2CD] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#9C4453]">
                          AI Confidence Distribution
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
                                  isTop
                                    ? "font-bold text-[#3A2829]"
                                    : "font-medium text-[#6E5355]"
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
                                style={{
                                  width: `${Math.max(item.percentage, 3)}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN: DETAIL DIAGNOSIS BERLAPIS */}
                <div className="lg:col-span-7 space-y-5">
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

                    <div className="bg-[#FFF9F7] rounded-2xl p-4 border border-[#F2DDD9] text-xs md:text-[13px] text-[#594042] leading-relaxed">
                      {result.description}
                    </div>
                  </div>

                  {/* Masalah Kulit & Kandungan Aktif */}
                  <div className="bg-white/90 rounded-[28px] p-6 border border-[#F0D2CD] shadow-xs space-y-5">
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

                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="font-serif-figma text-base font-bold text-[#3A2829]">
                          Rekomendasi Kandungan Aktif (Key Ingredients)
                        </h4>
                        <span className="text-[11px] text-[#4F6F5B] font-semibold">
                          Sesuai Profil Kulit
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

                    <div className="bg-[#FFF6F5] rounded-2xl p-3.5 border border-[#F5D5D0] flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#9C4453]">
                        ⚠️ Hindari Kandungan Berikut:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.avoidIngredients.map((av, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 rounded-lg bg-white border border-[#E0C0BA] text-[#7A444B] font-medium"
                          >
                            ✕ {av}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Catatan & Tombol Aksi */}
                  <div className="bg-white/90 rounded-[28px] p-5 border border-[#F0D2CD] shadow-xs space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#594042] mb-1">
                        Catatan Kondisi Kulit Pribadi (Opsional):
                      </label>
                      <input
                        type="text"
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="Ketik catatan keluhan kulitmu di sini..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E8C8C3] bg-[#FFFDFC] text-xs focus:outline-none focus:border-[#D47484]"
                      />
                    </div>

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
            STEP 5: REKOMENDASI PRODUK 3 TIER DENGAN GAMBAR DARI DATABASE
           ===================================================================== */}
        {step === 5 && result && (
          <div className="space-y-7">
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

              {/* Filter Pill Tier Harga */}
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
                  Filter Alergi:{" "}
                  <strong>{questionnaire.allergy || "Tidak ada"}</strong>
                </span>
              </div>
            </div>

            {/* Grid Kartu Produk dengan Foto Asli / Kemasan dari Database */}
            {result.products.filter(
              (p) =>
                selectedTierFilter === "Semua" || p.tier === selectedTierFilter
            ).length === 0 ? (
              <div className="bg-white/95 rounded-[28px] p-10 text-center text-sm text-[#7A5E60] border border-[#F0D2CD]">
                Tidak ada produk pada filter <strong>Tier {selectedTierFilter}</strong>. Silakan pilih tab <strong>Semua Tier Harga</strong> di atas.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {result.products
                  .filter(
                    (p) =>
                      selectedTierFilter === "Semua" ||
                      p.tier === selectedTierFilter
                  )
                  .map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-[28px] p-5 border border-[#F0D2CD] shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div>
                        {/* Area Gambar Produk dari Database */}
                        <div className="relative h-48 rounded-2xl bg-gradient-to-b from-[#FADAD6]/40 to-[#FCEAE8]/60 mb-4 overflow-hidden flex items-center justify-center border border-[#F2C6C2]">
                          <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-white/95 text-[#9C4453] text-[10px] font-extrabold shadow-2xs">
                            Tier {prod.tier}
                          </span>

                          {prod.routineTime && (
                            <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-[#4F6F5B] text-white text-[10px] font-bold">
                              {prod.routineTime}
                            </span>
                          )}

                          <img
                            src={prod.imageUrl}
                            alt={`${prod.brand} - ${prod.name}`}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget
                                .nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = "flex";
                            }}
                            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Fallback jika gambar gagal dimuat */}
                          <div
                            style={{ display: "none" }}
                            className="flex-col items-center justify-center text-center p-4"
                          >
                            <span className="font-serif-figma text-sm font-bold text-[#3A2829]">
                              {prod.brand}
                            </span>
                            <span className="text-[10px] text-[#9C4453] mt-1">
                              {prod.category}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#C85A6B]">
                          {prod.brand} • {prod.category}
                        </p>
                        <h3 className="font-serif-figma text-lg font-bold text-[#3A2829] leading-snug mt-0.5 mb-1">
                          {prod.name}
                        </h3>
                        <p className="text-base font-extrabold text-[#4F6F5B] mb-2">
                          {prod.price}
                        </p>
                        <p className="text-xs text-[#6E5355] leading-relaxed mb-3 line-clamp-2">
                          {prod.description}
                        </p>

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
            )}
          </div>
        )}
      </main>
    </div>
  );
}