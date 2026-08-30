"use client";

import { Activity, CalendarDays, Eye, Monitor, RefreshCw, Smartphone, Tablet, Users } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

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

function waveGeometry(values: number[]) {
  const width = 720;
  const height = 220;
  const padding = { top: 22, right: 14, bottom: 38, left: 14 };
  const baseline = height - padding.bottom;
  const max = Math.max(1, ...values);
  const points = values.map((value, index) => ({
    x: padding.left + (index / Math.max(1, values.length - 1)) * (width - padding.left - padding.right),
    y: padding.top + (1 - value / max) * (baseline - padding.top),
    value,
  }));
  if (!points.length) return { width, height, baseline, max, points, line: "", area: "" };
  let line = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index++) {
    const previous = points[index - 1];
    const current = points[index];
    const middle = (previous.x + current.x) / 2;
    line += ` C ${middle} ${previous.y}, ${middle} ${current.y}, ${current.x} ${current.y}`;
  }
  return { width, height, baseline, max, points, line, area: `${line} L ${points.at(-1)!.x} ${baseline} L ${points[0].x} ${baseline} Z` };
}

export function TrafficDashboard({ initialSnapshot }: { initialSnapshot: TrafficSnapshot }) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [range, setRange] = useState<7 | 30>(7);
  const [status, setStatus] = useState<"live" | "refreshing" | "error">("live");
  const activeRequest = useRef<AbortController | null>(null);
  const gradientId = useId().replaceAll(":", "");

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

  const chartData = snapshot.history.slice(-range);
  const wave = waveGeometry(chartData.map((point) => point.value));
  const topPageViews = Math.max(1, snapshot.popularPages[0]?.views ?? 0);
  const totalDevices = snapshot.devices.reduce((total, item) => total + item.visitors, 0);
  const updatedTime = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(snapshot.updatedAt));

  return (
    <section className="traffic-board" aria-labelledby="traffic-title">
      <div className="traffic-board-heading">
        <div>
          <p className="admin-eyebrow">ANALYTICS WEBSITE</p>
          <h2 id="traffic-title">Statistik pengunjung website</h2>
          <p>Histori tetap tersedia meskipun sedang tidak ada pengunjung realtime.</p>
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
          <span><CalendarDays aria-hidden /></span>
          <div><small>7 hari terakhir</small><strong>{number.format(snapshot.visitors7Days)}</strong></div>
        </article>
        <article className="traffic-metric-card">
          <span><CalendarDays aria-hidden /></span>
          <div><small>30 hari terakhir</small><strong>{number.format(snapshot.visitors30Days)}</strong></div>
        </article>
      </div>

      <div className="traffic-detail-grid">
        <article className="traffic-chart-card">
          <header><div><span>{range} HARI TERAKHIR</span><h3>Tren pengunjung</h3></div><div className="traffic-range-filter" aria-label="Pilih rentang grafik"><button type="button" className={range === 7 ? "active" : ""} onClick={() => setRange(7)}>7 hari</button><button type="button" className={range === 30 ? "active" : ""} onClick={() => setRange(30)}>30 hari</button></div></header>
          <div className="traffic-wave-chart" role="img" aria-label={`Grafik pengunjung ${range} hari terakhir, tertinggi ${wave.max} pengunjung per hari`}>
            <svg viewBox={`0 0 ${wave.width} ${wave.height}`} preserveAspectRatio="none" aria-hidden>
              <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4ad4f" stopOpacity=".42" /><stop offset="100%" stopColor="#d4ad4f" stopOpacity=".025" /></linearGradient></defs>
              {[.25,.5,.75,1].map((ratio) => <line key={ratio} x1="14" x2="706" y1={22 + (wave.baseline - 22) * ratio} y2={22 + (wave.baseline - 22) * ratio} className="traffic-wave-grid" />)}
              <path d={wave.area} fill={`url(#${gradientId})`} className="traffic-wave-area" />
              <path d={wave.line} className="traffic-wave-line" />
              {wave.points.map((point, index) => <g key={`${chartData[index]?.label}-${index}`}><circle cx={point.x} cy={point.y} r={range === 7 ? 4.5 : 2.7} className="traffic-wave-point"><title>{`${chartData[index]?.label}: ${point.value} pengunjung`}</title></circle>{range === 7 && point.value ? <text x={point.x} y={point.y - 11} textAnchor="middle" className="traffic-wave-value">{point.value}</text> : null}</g>)}
              {chartData.map((point, index) => index === 0 || index === chartData.length - 1 || index % (range === 7 ? 1 : 5) === 0 ? <text key={`label-${point.label}-${index}`} x={wave.points[index]?.x} y="211" textAnchor={index === 0 ? "start" : index === chartData.length - 1 ? "end" : "middle"} className="traffic-wave-label">{point.label}</text> : null)}
            </svg>
          </div>
        </article>

        <article className="traffic-pages-card">
          <header><div><span>HARI INI · {number.format(snapshot.pageViewsToday)} TAMPILAN</span><h3>Halaman populer</h3></div><small>{snapshot.pagesPerVisit.toLocaleString("id-ID", { maximumFractionDigits: 1 })} halaman/kunjungan</small></header>
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

      <section className="traffic-recent" aria-label="Pengunjung terbaru">
        <header><div><span>AKTIVITAS TERBARU</span><h3>Pengunjung terbaru</h3></div><small>Waktu Indonesia Barat</small></header>
        {snapshot.recentVisitors.length ? <div>{snapshot.recentVisitors.map((visitor) => {
          const details = deviceDetails[visitor.device as keyof typeof deviceDetails] ?? deviceDetails.desktop;
          const Icon = details.icon;
          const seen = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(visitor.lastSeenAt));
          return <article key={visitor.sessionId}><span><Icon aria-hidden /></span><div><strong>{pathLabel(visitor.path)}</strong><small>{details.label} · {seen}</small></div>{visitor.utmSource || visitor.utmCampaign ? <em>{[visitor.utmSource, visitor.utmCampaign].filter(Boolean).join(" · ")}</em> : <em>Organik / langsung</em>}</article>;
        })}</div> : <div className="traffic-empty compact"><Eye aria-hidden /><p>Belum ada histori kunjungan.</p></div>}
      </section>

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
