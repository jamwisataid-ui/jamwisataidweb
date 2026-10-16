import { Room, RoomEvent, Track } from "livekit-client";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

export function LiveRoom({ serverUrl, token, onDisconnected }: { serverUrl: string; token: string; onDisconnected: () => void }) {
  const [status, setStatus] = useState<"connecting" | "connected" | "reconnecting">("connecting");
  useEffect(() => {
    const room = new Room({ adaptiveStream: true, dynacast: true });
    let disposed = false;
    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio && typeof document !== "undefined") {
        const element = track.attach();
        element.dataset.liveMuthowifAudio = "true";
        element.style.display = "none";
        document.body.appendChild(element);
      }
    });
    room.on(RoomEvent.Reconnecting, () => setStatus("reconnecting"));
    room.on(RoomEvent.Reconnected, () => setStatus("connected"));
    room.on(RoomEvent.Disconnected, () => { if (!disposed) onDisconnected(); });
    void room.connect(serverUrl, token).then(() => setStatus("connected")).catch(() => { if (!disposed) onDisconnected(); });
    return () => {
      disposed = true;
      room.disconnect();
      if (typeof document !== "undefined") document.querySelectorAll("[data-live-muthowif-audio]").forEach((element) => element.remove());
    };
  }, [onDisconnected, serverUrl, token]);
  const label = status === "connected" ? "Terhubung ke siaran" : status === "reconnecting" ? "Menyambungkan kembali..." : "Menghubungkan ke siaran...";
  return <View style={styles.status}><View style={[styles.liveDot, status !== "connected" && styles.waitingDot]} /><Text style={styles.label}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  status: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  liveDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#22C55E" },
  waitingDot: { backgroundColor: colors.gold },
  label: { color: colors.white, fontFamily: typography.semibold, fontSize: 13 },
});
