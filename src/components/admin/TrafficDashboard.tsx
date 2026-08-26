"use client";

import { Activity, Eye, Monitor, MousePointerClick, RefreshCw, Smartphone, Tablet, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { TrafficSnapshot } from "@/lib/analytics";

const number = new Intl.NumberFormat("id-ID");
const deviceDetails = {
  desktop: { label: "Desktop", icon: Monitor },
  mobile: { label: "Ponsel", icon: Smartphone },
  tablet: { label: "Tablet", icon: Tablet },
} as const;

function pathLabel(path: string) {
  if (path === "/") return "Beranda";
  return path
    .split("/")
    .filter(Boolean)
    .map((part) => part.replaceAll("-", " "))
    .join(" / ");
}

export function TrafficDashboard({ initialSnapshot }: { initialSnapshot: TrafficSnapshot }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [status, setStatus] = useState<"live" | "refreshing" | "error">("live");
  const activeRequest = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setStatus("refreshing");

    try {
      const response = await fetch("/api/admin/traffic", { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Traffic tidak dapat dimuat.");
      setSnapshot(await response.json() as TrafficSnapshot);
      setStatus("live");
    } catch (error) {
      if ((error as Error).name !== "AbortError") setStatus("error");
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 15_000);
    return () => {
      window.clearInterval(interval);
      activeRequest.current?.abort();
    };
  }, [refresh]);

  const maxTimeline = Math.max(1, ...snapshot.timeline.map((point) => point.value));
  const topPageViews = Math.max(1, snapshot.popularPages[0]?.views ?? 0);
  const totalDevices = snapshot.devices.reduce((total, item) => total + item.visitors, 0);
  const updatedTime = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(snapshot.updatedAt));

  return (
    <section className="traffic-board" aria-labelledby="traffic-title">
      <div className="traffic-board-heading">
        <div>
          <p className="admin-eyebrow">TRAFFIC WEBSITE • REALTIME</p>
          <h2 id="traffic-title">Jamaah sedang melihat website</h2>
          <p>Aktivitas diperbarui otomatis setiap 15 detik.</p>
        </div>
        <button className="traffic-refresh" type="button" onClick={() => void refresh()} disabled={status === "refreshing"}>
          <RefreshCw aria-hidden className={status === "refreshing" ? "is-spinning" : ""} />
          <span>{status === "error" ? "Coba lagi" : `Update ${updatedTime}`}</span>
        </button>
      </div>

      <div className="traffic-metrics">
        <article className="traffic-live-card">
          <div className="traffic-live-label"><i aria-hidden /> LIVE SEKARANG</div>
          <strong>{number.format(snapshot.liveVisitors)}</strong>
          <p>pengunjung aktif dalam 5 menit terakhir</p>
          <Activity aria-hidden className="traffic-live-wave" />
        </article>
        <article className="traffic-metric-card">
          <span><Users aria-hidden /></span>
          <div><small>Pengunjung hari ini</small><strong>{number.format(snapshot.visitorsToday)}</strong></div>
        </article>
        <article className="traffic-metric-card">
          <span><Eye aria-hidden /></span>
          <div><small>Halaman dilihat</small><strong>{number.format(snapshot.pageViewsToday)}</strong></div>
        </article>
        <article className="traffic-metric-card">
          <span><MousePointerClick aria-hidden /></span>
          <div><small>Halaman / kunjungan</small><strong>{snapshot.pagesPerVisit.toLocaleString("id-ID", { maximumFractionDigits: 1 })}</strong></div>
        </article>
      </div>

      <div className="traffic-detail-grid">
        <article className="traffic-chart-card">
          <header><div><span>60 MENIT TERAKHIR</span><h3>Irama kunjungan</h3></div><small><i aria-hidden /> Data langsung</small></header>
          <div className="traffic-chart" role="img" aria-label={`Grafik kunjungan 60 menit terakhir, tertinggi ${maxTimeline} tampilan per 5 menit`}>
            {snapshot.timeline.map((point, index) => (
              <div className="traffic-bar-column" key={`${point.label}-${index}`}>
                <span className="traffic-bar-value">{point.value || ""}</span>
                <i style={{ height: `${Math.max(5, (point.value / maxTimeline) * 100)}%` }} />
                <small>{index % 3 === 0 || index === snapshot.timeline.length - 1 ? point.label : ""}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="traffic-pages-card">
          <header><div><span>HARI INI</span><h3>Halaman populer</h3></div></header>
          {snapshot.popularPages.length ? (
            <ol>
              {snapshot.popularPages.map((page, index) => (
                <li key={page.path}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{pathLabel(page.path)}</strong><i><b style={{ width: `${(page.views / topPageViews) * 100}%` }} /></i></div>
                  <em>{number.format(page.views)}</em>
                </li>
              ))}
            </ol>
          ) : <div className="traffic-empty"><Eye aria-hidden /><p>Belum ada kunjungan hari ini.</p></div>}
        </article>
      </div>

      <div className="traffic-devices" aria-label="Perangkat pengunjung hari ini">
        <span>PERANGKAT</span>
        {snapshot.devices.length ? snapshot.devices.map((item) => {
          const details = deviceDetails[item.device as keyof typeof deviceDetails] ?? deviceDetails.desktop;
          const Icon = details.icon;
          const percentage = totalDevices ? Math.round((item.visitors / totalDevices) * 100) : 0;
          return <div key={item.device}><Icon aria-hidden /><strong>{details.label}</strong><small>{percentage}%</small></div>;
        }) : <p>Data perangkat akan muncul setelah ada pengunjung.</p>}
        <div className={`traffic-connection is-${status}`} role="status"><i aria-hidden />{status === "error" ? "Koneksi terputus" : status === "refreshing" ? "Memperbarui" : "Terhubung"}</div>
      </div>
    </section>
  );
}
