import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Montserrat, Reem_Kufi } from "next/font/google";
import "lite-youtube-embed/src/lite-yt-embed.css";
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
  title: "Jam Wisata | Setiap Waktu Bernilai Ibadah",
  description:
    "Jam Wisata tidak hanya mengantarkan langkah menuju Baitullah, tetapi juga menemani perjalanan hati menuju Allah. Pendampingan ibadah yang amanah, profesional, dan penuh keberkahan.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Jam Wisata | Setiap Waktu Bernilai Ibadah",
    description:
      "Setiap Waktu Bernilai Ibadah — pendampingan ibadah yang amanah, profesional, dan penuh keberkahan.",
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
      className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable} ${reemKufi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#333333]">{children}</body>
    </html>
  );
}
