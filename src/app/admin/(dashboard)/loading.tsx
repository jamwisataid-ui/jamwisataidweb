import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="admin-loading-screen" role="status" aria-live="polite">
      <div className="admin-loading-card">
        <div className="admin-loading-spinner-wrap">
          <Loader2 className="admin-spinner" />
        </div>
        <strong>Memuat data...</strong>
        <p>Mohon tunggu sebentar, sistem sedang mengambil data terbaru.</p>
      </div>

      <div className="admin-skeleton-wrap" aria-hidden="true">
        <div className="admin-skeleton-header" />
        <div className="admin-skeleton-grid">
          <div className="admin-skeleton-card" />
          <div className="admin-skeleton-card" />
          <div className="admin-skeleton-card" />
        </div>
        <div className="admin-skeleton-panel" />
      </div>
    </div>
  );
}
