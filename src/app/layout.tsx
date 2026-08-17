import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "lite-youtube-embed/src/lite-yt-embed.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jamwisata.id"),
  title: "Jam Wisata | Paket Umrah & Wisata Halal Tepercaya",
  description:
    "Temukan pilihan paket umrah dan wisata halal bersama Jam Wisata. Dapatkan informasi jadwal, fasilitas, akomodasi, serta konsultasi perjalanan melalui WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jam Wisata | Paket Umrah & Wisata Halal Tepercaya",
    description:
      "Perjalanan umrah yang nyaman, terarah, dan dipersiapkan dengan sepenuh hati.",
    url: "https://jamwisata.id",
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
