import { ImageResponse } from "next/og";
import { getPublishedPackages } from "@/lib/cms/public";
import { formatIDR } from "@/data/jamwisata";

export const runtime = "nodejs";
export const alt = "Paket Umroh Jam Wisata";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function PackageOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const packages = await getPublishedPackages();
  const pkg = packages.find((p) => p.slug === slug);

  const title = pkg?.name || "Paket Umroh Jam Wisata";
  const duration = pkg?.durationDays ? `${pkg.durationDays} Hari` : "9 Hari";
  const departureDate = pkg?.departureDate || "Musim Umroh 2026";
  const airline = pkg?.airline || "Maskapai Bintang 5";
  const price = pkg?.priceFrom ? `Rp ${formatIDR(pkg.priceFrom)}` : "Hubungi Kami";
  const makkahHotel = pkg?.makkahHotel?.name || "Hotel Bintang 5 Makkah";
  const madinahHotel = pkg?.madinahHotel?.name || "Hotel Bintang 4/5 Madinah";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "50px 60px",
          background: "linear-gradient(135deg, #071a35 0%, #0c2b57 60%, #071a35 100%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.28) 0%, rgba(212, 175, 55, 0) 70%)",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                background: "#bd8d1b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "22px",
                color: "#071a35",
              }}
            >
              JW
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "0.08em", color: "#f5eedb" }}>
                JAM WISATA
              </span>
              <span style={{ fontSize: "12px", color: "#d8b65c", letterSpacing: "0.1em" }}>
                TRAVEL UMROH BERLANDASKAN SUNNAH
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(189, 141, 27, 0.2)",
              border: "1px solid rgba(216, 182, 92, 0.6)",
              color: "#f5eedb",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {duration} • Keberangkatan {departureDate}
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "960px",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#d8b65c", letterSpacing: "0.15em" }}>
            PROGRAM PERJALANAN UMROH
          </div>

          <h1
            style={{
              fontSize: "46px",
              fontWeight: "800",
              lineHeight: 1.15,
              color: "#ffffff",
              margin: 0,
            }}
          >
            {title}
          </h1>

          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "6px" }}>
            <span style={{ fontSize: "20px", color: "#94a3b8" }}>Mulai dari</span>
            <span style={{ fontSize: "40px", fontWeight: "800", color: "#d8b65c", letterSpacing: "-0.01em" }}>
              {price}
            </span>
            <span style={{ fontSize: "16px", color: "#cbd5e1" }}>/ Jamaah (All In)</span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "14px 18px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>Penerbangan</span>
            <strong style={{ fontSize: "16px", color: "#ffffff", marginTop: "4px" }}>{airline}</strong>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "14px 18px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>Hotel Makkah</span>
            <strong style={{ fontSize: "16px", color: "#ffffff", marginTop: "4px" }}>{makkahHotel}</strong>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "14px 18px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>Hotel Madinah</span>
            <strong style={{ fontSize: "16px", color: "#ffffff", marginTop: "4px" }}>{madinahHotel}</strong>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
