"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ScanHistoryItem {
  id: number;
  image_path: string;
  skin_type: string;
  skin_issues: string;
  recommendations: string;
  created_at: string;
}

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

export default function SkinHistoryPage() {
  const router = useRouter();
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("Silakan login terlebih dahulu untuk melihat riwayat pemindaian kulit.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/skin-scans", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Gagal memuat riwayat pemindaian.");
        }

        setScans(data.data || []);
      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDeleteScan = async (id: number) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus riwayat pemindaian ini?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setDeletingId(id);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/skin-scans/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Gagal menghapus riwayat scan.");
      }

      setScans((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menghapus data.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSignOut = async () => {
    const confirmed = window.confirm("Apakah Anda yakin ingin keluar (Sign Out)?");
    if (!confirmed) return;

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
      router.push("/login");
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

      {/* Ornamen Latar Belakang Figma */}
      <div className="w-[380px] h-[380px] rounded-full bg-gradient-to-br from-[#FADAD6]/80 to-[#FDECE9]/40 absolute -top-28 -right-24 pointer-events-none" />
      <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#FADAD6]/75 to-[#FDECE9]/30 absolute -bottom-36 -left-28 pointer-events-none" />

      <BotanicalCornerSVG className="w-40 h-40 absolute top-6 left-4 opacity-75 -rotate-12" />
      <BotanicalCornerSVG className="w-44 h-44 absolute top-10 right-6 opacity-80 rotate-90" />
      <BotanicalCornerSVG className="w-44 h-44 absolute bottom-4 left-8 opacity-80 -rotate-45" />
      <BotanicalCornerSVG className="w-40 h-40 absolute bottom-6 right-8 opacity-75 rotate-180" />

      {/* Navbar */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 relative z-20 border-b border-[#F2DDD9]/70">
        <a href="/" className="flex items-center gap-2.5 text-left">
          <div className="w-9 h-9 rounded-full bg-[#FADAD6] border border-[#E5B8B3] flex items-center justify-center shadow-xs">
            <span className="font-serif-figma font-bold text-[#9C4453] text-lg">
              D
            </span>
          </div>
          <span className="font-serif-figma text-2xl font-bold tracking-tight text-[#3A2829]">
            DermaMate<span className="text-[#D47484] italic">.AI</span>
          </span>
        </a>

        <div className="flex flex-wrap items-center gap-2.5 font-sans-figma">
          <a
            href="/"
            className="px-4 py-2 rounded-full bg-white text-[#3A2829] border border-[#E5B8B3] text-xs font-semibold hover:bg-[#FDF1EE] transition shadow-2xs"
          >
            ← Beranda
          </a>
          <a
            href="/"
            className="px-5 py-2 rounded-full bg-[#4F6F5B] text-white text-xs font-bold hover:bg-[#3E5948] transition shadow-xs"
          >
            + Scan Baru
          </a>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition shadow-2xs"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10 relative z-10 font-sans-figma">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#FADAD6]/80 text-[#9C4453] text-xs font-semibold tracking-wide mb-2">
            ✨ Dokumentasi Perkembangan Kulit
          </span>
          <h1 className="font-serif-figma text-3xl md:text-4xl font-bold text-[#3A2829]">
            Riwayat Pemindaian Kulit (Skin History)
          </h1>
          <p className="text-xs text-[#7A5E60] mt-1">
            Catatan seluruh hasil diagnosis AI wajah Anda yang tersimpan aman di
            akun DermaMate.AI
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-sm text-[#7A5E60] py-16 bg-white/80 rounded-[32px] border border-[#F0D2CD]">
            Memuat riwayat pemindaian kulit...
          </div>
        ) : errorMsg ? (
          <div className="bg-white/95 rounded-[32px] p-10 text-center border border-[#F0D2CD] max-w-md mx-auto shadow-sm">
            <p className="text-sm text-red-600 font-medium mb-4">{errorMsg}</p>
            <a
              href="/login"
              className="inline-block px-7 py-3 rounded-full bg-[#D47484] text-white text-xs font-bold hover:bg-[#be5f6f] transition"
            >
              Login Sekarang
            </a>
          </div>
        ) : scans.length === 0 ? (
          <div className="bg-gradient-to-br from-[#FDF1EE] via-white to-[#FCEAE6] rounded-[32px] p-12 text-center border border-[#F0D2CD] max-w-lg mx-auto shadow-sm">
            <p className="font-serif-figma text-xl font-bold text-[#3A2829] mb-2">
              Belum Ada Riwayat Pemindaian
            </p>
            <p className="text-xs text-[#7A5E60] mb-6">
              Anda belum melakukan pemindaian kulit wajah. Mulai scan pertama
              Anda sekarang untuk memantau kondisi kulit.
            </p>
            <a
              href="/"
              className="inline-block px-7 py-3 rounded-full bg-[#4F6F5B] text-white text-xs font-bold hover:bg-[#3E5948] transition"
            >
              Mulai Scan Wajah →
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <div
                key={scan.id}
                className="bg-white/95 rounded-[28px] p-5 shadow-sm border border-[#F0D2CD] flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="h-48 rounded-2xl overflow-hidden bg-[#EAD3CF] mb-4 border border-[#F2C6C2] relative">
                    <img
                      src={`http://127.0.0.1:8000/storage/${scan.image_path}`}
                      alt={scan.skin_type}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[#9C4453] text-[10px] font-extrabold shadow-2xs">
                      {new Date(scan.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A6B]">
                    Hasil Diagnosis AI
                  </span>
                  <h3 className="font-serif-figma text-2xl font-bold text-[#3A2829] mt-0.5 mb-2">
                    {scan.skin_type}
                  </h3>

                  <div className="bg-[#FFF8F6] rounded-xl p-3 border border-[#F2DDD9] mb-3">
                    <p className="text-[11px] font-bold text-[#9C4453] mb-0.5">
                      Kondisi Terdeteksi:
                    </p>
                    <p className="text-xs text-[#594042] leading-relaxed">
                      {scan.skin_issues}
                    </p>
                  </div>

                  <p className="text-xs text-[#6E5355] leading-relaxed mb-4">
                    {scan.recommendations}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteScan(scan.id)}
                  disabled={deletingId === scan.id}
                  className="w-full py-2.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition disabled:opacity-50"
                >
                  {deletingId === scan.id
                    ? "Menghapus..."
                    : "🗑️ Hapus Riwayat Scan"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}