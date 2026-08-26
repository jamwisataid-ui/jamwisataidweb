import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jam Wisata - Travel Umroh Terpercaya & Berlandaskan Sunnah";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #071a35 0%, #0c2b57 50%, #071a35 100%)",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Golden Pattern Accents */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0) 70%)",
          }}
        />

        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: "#bd8d1b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "24px",
                color: "#071a35",
                boxShadow: "0 4px 14px rgba(189, 141, 27, 0.4)",
              }}
            >
              JW
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  letterSpacing: "0.1em",
                  color: "#f5eedb",
                }}
              >
                JAM WISATA
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  letterSpacing: "0.15em",
                  color: "#d8b65c",
                }}
              >
                PT JARIS AMMAR MADANI
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "999px",
              background: "rgba(189, 141, 27, 0.18)",
              border: "1px solid rgba(216, 182, 92, 0.5)",
              color: "#f5eedb",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.05em",
            }}
          >
            Izin Resmi PPIU No. 534 Tahun 2019
          </div>
        </div>

        {/* Middle Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "920px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#d8b65c",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              ✦ Biro Perjalanan Umroh Terpercaya Bandung
            </span>
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: "800",
              lineHeight: 1.15,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Ibadah Nyaman, Amanah, & Sesuai Tuntunan Sunnah
          </h1>

          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.4,
              color: "#cbd5e1",
              margin: 0,
              maxWidth: "850px",
            }}
          >
            Paket Umroh 2026 – 2027 All In dengan Fasilitas Bintang 5, Bimbingan Ibadah Berpengalaman, dan Hotel Dekat Masjid.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div style={{ display: "flex", gap: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e2e8f0", fontSize: "16px", fontWeight: "600" }}>
              <span style={{ color: "#d8b65c" }}>✓</span> Maskapai Bintang 5
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e2e8f0", fontSize: "16px", fontWeight: "600" }}>
              <span style={{ color: "#d8b65c" }}>✓</span> Hotel Dekat Pelataran
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e2e8f0", fontSize: "16px", fontWeight: "600" }}>
              <span style={{ color: "#d8b65c" }}>✓</span> Bimbingan Sesuai Sunnah
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "18px",
              fontWeight: "700",
              color: "#d8b65c",
              letterSpacing: "0.05em",
            }}
          >
            jamwisata.id
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
