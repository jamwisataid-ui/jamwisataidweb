import { MobileApiError } from "./api";

export type MuthowifSessionStatus = "scheduled" | "live" | "ended" | "cancelled";

export function assertMuthowifSessionBroadcastable(status: MuthowifSessionStatus) {
  if (status === "ended" || status === "cancelled") {
    throw new MobileApiError(409, "LIVE_SESSION_ENDED", "Siaran ini telah berakhir.");
  }
}

export function clampLiveListenerCount(listenerCount: number, capacity: number) {
  return Math.max(0, Math.min(Math.trunc(listenerCount), Math.max(0, capacity)));
}
