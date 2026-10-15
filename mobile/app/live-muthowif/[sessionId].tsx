import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LiveRoom } from "@/components/live/live-room";
import { useLiveRoomStore } from "@/lib/live-room-store";
import { colors, gradients, typography } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function LiveMuthowifListenerScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const credentials = useLiveRoomStore((state) => state.credentials);
  const setCredentials = useLiveRoomStore((state) => state.setCredentials);
  const leave = useCallback(() => { setCredentials(null); router.replace("/live-muthowif" as never); }, [setCredentials]);
  useEffect(() => { if (!credentials || credentials.session.id !== sessionId) router.replace("/live-muthowif" as never); }, [credentials, sessionId]);
  if (!credentials || credentials.session.id !== sessionId) return null;
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><LinearGradient colors={gradients.navy} style={styles.screen}><View style={styles.header}><Pressable onPress={leave} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.white} /></Pressable><Text style={styles.headerTitle}>LIVE MUTHOWIF</Text><View style={styles.back} /></View><View style={styles.content}><View style={styles.broadcast}><View style={styles.outer}><View style={styles.inner}><Ionicons name="headset" size={58} color={colors.gold} /></View></View></View><Text style={styles.live}>SIARAN LANGSUNG</Text><Text style={styles.title}>{credentials.session.title}</Text><Text style={styles.muthowif}>{credentials.session.muthowifName}</Text><LiveRoom serverUrl={credentials.serverUrl} token={credentials.token} onDisconnected={leave} /><Text style={styles.hint}>Pastikan volume perangkat aktif. Anda bergabung sebagai pendengar.</Text></View><Pressable onPress={leave} style={styles.leave}><Ionicons name="exit-outline" size={20} color={colors.white} /><Text style={styles.leaveText}>Keluar dari Siaran</Text></Pressable></LinearGradient></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.navyDeep },
  screen: { flex: 1, paddingHorizontal: 20, paddingBottom: 24 },
  header: { minHeight: 62, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: colors.white, fontFamily: typography.heading, fontSize: 18 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 38 },
  broadcast: { marginBottom: 26 },
  outer: { width: 156, height: 156, borderRadius: 78, borderWidth: 1, borderColor: "rgba(212,175,55,.22)", alignItems: "center", justifyContent: "center" },
  inner: { width: 118, height: 118, borderRadius: 59, backgroundColor: "rgba(212,175,55,.11)", borderWidth: 1, borderColor: "rgba(212,175,55,.42)", alignItems: "center", justifyContent: "center" },
  live: { color: colors.gold, fontFamily: typography.bold, fontSize: 11, letterSpacing: 1.6, marginBottom: 10 },
  title: { color: colors.white, fontFamily: typography.heading, fontSize: 26, lineHeight: 34, textAlign: "center" },
  muthowif: { color: "rgba(255,255,255,.72)", fontFamily: typography.medium, fontSize: 14, marginTop: 8, marginBottom: 22 },
  hint: { maxWidth: 300, color: "rgba(255,255,255,.55)", fontFamily: typography.body, fontSize: 11.5, lineHeight: 18, textAlign: "center", marginTop: 16 },
  leave: { minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,.23)", backgroundColor: "rgba(255,255,255,.08)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  leaveText: { color: colors.white, fontFamily: typography.bold, fontSize: 14 },
});
