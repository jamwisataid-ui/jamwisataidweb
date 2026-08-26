import type { Metadata } from "next";
import { Suspense } from "react";
import { Cinzel, Cormorant_Garamond, Montserrat, Reem_Kufi } from "next/font/google";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
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

import { defaultOpenGraphImages, defaultTwitterImages, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Travel Umroh Terpercaya & Berlandaskan Sunnah | Jam Wisata",
    template: "%s | Jam Wisata",
  },
  description:
    "Jam Wisata adalah travel umroh amanah dan profesional dari Bandung. Temukan paket umroh 2026–2027, jadwal keberangkatan, hotel dekat masjid, maskapai bintang 5, bimbingan sunnah, dan konsultasi gratis.",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Travel Umroh Terpercaya & Berlandaskan Sunnah | Jam Wisata",
    description:
      "Jam Wisata adalah travel umroh amanah dan profesional dari Bandung. Temukan paket umroh 2026–2027, jadwal keberangkatan, hotel dekat masjid, maskapai bintang 5, bimbingan sunnah, dan konsultasi gratis.",
    url: SITE_URL,
    siteName: "Jam Wisata",
    locale: "id_ID",
    type: "website",
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Umroh Terpercaya & Berlandaskan Sunnah | Jam Wisata",
    description:
      "Jam Wisata adalah travel umroh amanah dan profesional dari Bandung. Temukan paket umroh 2026–2027, jadwal keberangkatan, hotel dekat masjid, maskapai bintang 5, bimbingan sunnah, dan konsultasi gratis.",
    images: defaultTwitterImages,
  },
  icons: {
    icon: "/seo/icon-192.png",
    apple: "/seo/apple-touch-icon.png",
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
      <body className="min-h-full flex flex-col bg-white text-[#333333]">
        {children}
        <Suspense fallback={null}>
          <VisitorTracker />
        </Suspense>
      </body>
    </html>
  );
}
