import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Montserrat, Reem_Kufi } from "next/font/google";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jamwisata.id"),
  title: {
    default: "Travel Umroh Terpercaya & Berlandaskan Sunnah | Jam Wisata",
    template: "%s | Jam Wisata",
  },
  description:
    "Jam Wisata adalah travel umroh amanah dan profesional dari Bandung. Temukan paket umroh 2026–2027, jadwal keberangkatan, hotel, maskapai, bimbingan sunnah, dan konsultasi.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Travel Umroh Terpercaya & Berlandaskan Sunnah | Jam Wisata",
    description:
      "Jam Wisata adalah travel umroh amanah dan profesional dari Bandung. Temukan paket umroh 2026–2027, jadwal keberangkatan, hotel, maskapai, bimbingan sunnah, dan konsultasi.",
    url: "https://jamwisata.id",
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Umroh Terpercaya & Berlandaskan Sunnah | Jam Wisata",
    description:
      "Jam Wisata adalah travel umroh amanah dan profesional dari Bandung. Temukan paket umroh 2026–2027, jadwal keberangkatan, hotel, maskapai, bimbingan sunnah, dan konsultasi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable} ${reemKufi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#333333]">{children}</body>
    </html>
  );
}
