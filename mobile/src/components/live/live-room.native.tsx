import { AudioSession, LiveKitRoom, registerGlobals, useParticipants } from "@livekit/react-native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

registerGlobals();

function RoomStatus() {
  const participants = useParticipants();
  return <View style={styles.status}><View style={styles.liveDot} /><Text style={styles.label}>Terhubung · {participants.length} pendengar</Text></View>;
}

export function LiveRoom({ serverUrl, token, onDisconnected }: { serverUrl: string; token: string; onDisconnected: () => void }) {
  useEffect(() => {
    void AudioSession.startAudioSession();
    return () => { void AudioSession.stopAudioSession(); };
  }, []);
  return <LiveKitRoom serverUrl={serverUrl} token={token} connect audio={false} video={false} onDisconnected={onDisconnected}><RoomStatus /></LiveKitRoom>;
}

const styles = StyleSheet.create({
  status: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  liveDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#22C55E" },
  label: { color: colors.white, fontFamily: typography.semibold, fontSize: 13 },
});
