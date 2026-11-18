"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const endpoint = isRegister
      ? "http://127.0.0.1:8000/api/register"
      : "http://127.0.0.1:8000/api/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          isRegister ? { name, email, password } : { email, password }
        ),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Autentikasi gagal. Periksa kembali email dan password Anda."
        );
      }

      localStorage.setItem("token", data.access_token);
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#3A2829] relative overflow-hidden font-sans flex flex-col justify-between selection:bg-[#D47484]/20">
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
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative z-20 border-b border-[#F2DDD9]/70">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#FADAD6] border border-[#E5B8B3] flex items-center justify-center shadow-xs">
            <span className="font-serif-figma font-bold text-[#9C4453] text-lg">
              D
            </span>
          </div>
          <span className="font-serif-figma text-2xl font-bold tracking-tight text-[#3A2829]">
            DermaMate<span className="text-[#D47484] italic">.AI</span>
          </span>
        </a>

        <div className="flex items-center gap-2.5 font-sans-figma">
          <a
            href="/"
            className="px-4 py-2 rounded-full bg-white text-[#3A2829] border border-[#E5B8B3] text-xs font-semibold hover:bg-[#FDF1EE] transition shadow-2xs"
          >
            ← Beranda
          </a>
          {isLoggedIn && (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition shadow-2xs"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Form Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10 font-sans-figma">
        <div className="bg-[#FDF1EE] rounded-[36px] p-5 md:p-7 border border-[#F0D2CD] shadow-[0_16px_45px_-15px_rgba(180,120,125,0.22)] w-full max-w-md">
          <div className="bg-white/95 rounded-[28px] p-7 md:p-9 border border-[#F2DDD9] shadow-xs">
            <div className="text-center mb-6">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#FADAD6]/80 text-[#9C4453] text-[11px] font-bold mb-2">
                {isRegister ? "Registrasi Akun Baru" : "Akses Akun Pribadi"}
              </span>
              <h1 className="font-serif-figma text-2xl md:text-3xl font-bold text-[#3A2829]">
                {isRegister ? "Daftar DermaMate.AI" : "Masuk ke DermaMate.AI"}
              </h1>
              <p className="text-xs text-[#7A5E60] mt-1">
                {isRegister
                  ? "Buat akun baru untuk menyimpan riwayat pemindaian kulit Anda"
                  : "Masuk untuk mulai memindai wajah dan melihat riwayat analisis"}
              </p>
            </div>

            {errorMsg && (
              <div className="text-xs bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-[#3A2829] mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Zikry Huda"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8C8C3] bg-[#FFFDFC] text-sm focus:outline-none focus:border-[#D47484]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#3A2829] mb-1">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8C8C3] bg-[#FFFDFC] text-sm focus:outline-none focus:border-[#D47484]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2829] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8C8C3] bg-[#FFFDFC] text-sm focus:outline-none focus:border-[#D47484]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#4F6F5B] text-white text-sm font-bold hover:bg-[#3E5948] transition disabled:opacity-50 shadow-sm mt-2"
              >
                {isLoading
                  ? "Memproses..."
                  : isRegister
                  ? "Daftar Sekarang"
                  : "Masuk"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[#7A5E60]">
              {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrorMsg(null);
                }}
                className="text-[#D47484] font-bold hover:underline"
              >
                {isRegister ? "Masuk di sini" : "Daftar gratis"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}