import { AudioSession, LiveKitRoom, registerGlobals, useConnectionState } from "@livekit/react-native";
import { ConnectionState } from "livekit-client";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

registerGlobals();

function RoomStatus() {
  const connection = useConnectionState();
  const connected = connection === ConnectionState.Connected;
  const reconnecting = connection === ConnectionState.Reconnecting || connection === ConnectionState.SignalReconnecting;
  const label = connected ? "Terhubung ke siaran" : reconnecting ? "Menyambungkan kembali..." : "Menghubungkan ke siaran...";
  return <View style={styles.status}><View style={[styles.liveDot, !connected && styles.waitingDot]} /><Text style={styles.label}>{label}</Text></View>;
}

export function NativeLiveRoom({ serverUrl, token, onDisconnected }: { serverUrl: string; token: string; onDisconnected: () => void }) {
  useEffect(() => {
    void AudioSession.startAudioSession();
    return () => { void AudioSession.stopAudioSession(); };
  }, []);
  return <LiveKitRoom serverUrl={serverUrl} token={token} connect audio={false} video={false} onDisconnected={onDisconnected} onError={onDisconnected}><RoomStatus /></LiveKitRoom>;
}

const styles = StyleSheet.create({
  status: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  liveDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#22C55E" },
  waitingDot: { backgroundColor: colors.gold },
  label: { color: colors.white, fontFamily: typography.semibold, fontSize: 13 },
});
