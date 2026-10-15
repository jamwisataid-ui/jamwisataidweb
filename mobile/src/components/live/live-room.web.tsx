import { Room, RoomEvent, Track } from "livekit-client";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

export function LiveRoom({ serverUrl, token, onDisconnected }: { serverUrl: string; token: string; onDisconnected: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const room = new Room({ adaptiveStream: true, dynacast: true });
    const updateCount = () => setCount(room.remoteParticipants.size + 1);
    room.on(RoomEvent.ParticipantConnected, updateCount);
    room.on(RoomEvent.ParticipantDisconnected, updateCount);
    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio && typeof document !== "undefined") {
        const element = track.attach();
        element.dataset.liveMuthowifAudio = "true";
        element.style.display = "none";
        document.body.appendChild(element);
      }
    });
    room.on(RoomEvent.Disconnected, onDisconnected);
    void room.connect(serverUrl, token).then(updateCount).catch(onDisconnected);
    return () => {
      room.disconnect();
      if (typeof document !== "undefined") document.querySelectorAll("[data-live-muthowif-audio]").forEach((element) => element.remove());
    };
  }, [onDisconnected, serverUrl, token]);
  return <View style={styles.status}><View style={styles.liveDot} /><Text style={styles.label}>Terhubung · {count} pendengar</Text></View>;
}

const styles = StyleSheet.create({
  status: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  liveDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#22C55E" },
  label: { color: colors.white, fontFamily: typography.semibold, fontSize: 13 },
});
