import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "lite-youtube-embed/src/lite-yt-embed.css";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jamwisata.id"),
  title: "Jam Wisata | Setiap Waktu Bernilai Ibadah",
  description:
    "Jam Wisata mendampingi perjalanan menuju Baitullah dengan pelayanan yang amanah, profesional, dan penuh perhatian.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
