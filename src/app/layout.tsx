import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Montserrat,
  Playfair_Display,
  Reem_Kufi,
} from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jamwisata.id"),
  title: "Jam Wisata | Setiap Waktu Bernilai Ibadah",
  description:
    "Temukan pilihan paket umrah dan wisata halal bersama Jam Wisata. Dapatkan informasi jadwal, fasilitas, akomodasi, serta konsultasi perjalanan melalui WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jam Wisata | Setiap Waktu Bernilai Ibadah",
    description:
      "Perjalanan umrah yang nyaman, terarah, dan dipersiapkan dengan sepenuh hati.",
    url: "https://jamwisata.id",
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cinzel.variable} ${cormorant.variable} ${montserrat.variable} ${playfair.variable} ${reemKufi.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
