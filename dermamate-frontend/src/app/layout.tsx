import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DermaMate.AI - Analisis Jenis Kulit & Rekomendasi Skincare",
  description: "Sistem analisis 5 jenis kulit berbasis AI dan rekomendasi produk perawatan wajah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#FCE8EC] text-[#3D2C2E]">
        {children}
      </body>
    </html>
  );
}