import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          display: "grid",
          placeItems: "center",
          borderRadius: "50%",
          background: "#f7f2e4",
          color: "#996f0b",
        }}
      >
        <Loader2 style={{ width: "26px", height: "26px", animation: "spin 1s linear infinite" }} />
      </div>
      <p style={{ fontSize: "14px", color: "#64748b", fontWeight: "500", margin: 0 }}>
        Memuat halaman Jam Wisata...
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
