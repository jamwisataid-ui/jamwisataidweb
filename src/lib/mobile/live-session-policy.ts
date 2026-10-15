import { MobileApiError } from "./api";

export function assertLiveSessionJoinable(session: { status: "scheduled" | "live" | "ended" | "cancelled"; listenerCount: number; capacity: number }) {
  if (session.status === "ended" || session.status === "cancelled") {
    throw new MobileApiError(409, "LIVE_SESSION_ENDED", "Siaran telah berakhir.");
  }
  if (session.status !== "live") throw new MobileApiError(409, "LIVE_SESSION_NOT_STARTED", "Siaran belum dimulai.");
  if (session.listenerCount >= session.capacity) throw new MobileApiError(409, "LIVE_SESSION_FULL", "Sesi sedang penuh. Silakan coba beberapa saat lagi.");
}
