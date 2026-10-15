import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";

export function ItineraryState({ loading, error, onRetry }: { loading: boolean; error: boolean; onRetry: () => void }) {
  if (loading) return <View style={styles.skeleton}>{Array.from({ length: 5 }, (_, index) => <View key={index} style={styles.row}><View style={styles.circle} /><View style={styles.lines}><View style={[styles.line, { width: `${72 - index * 4}%` }]} /><View style={[styles.line, styles.short]} /></View></View>)}</View>;
  if (error) return <View style={styles.state}><Ionicons name="cloud-offline-outline" size={34} color={colors.gold} /><Text style={styles.title}>Itinerary belum dapat dimuat</Text><Text style={styles.body}>Periksa koneksi Anda, lalu coba kembali.</Text><Pressable onPress={onRetry} style={styles.button}><Text style={styles.buttonText}>Coba Lagi</Text></Pressable></View>;
  return <View style={styles.state}><Ionicons name="map-outline" size={34} color={colors.gold} /><Text style={styles.title}>Belum ada perjalanan</Text><Text style={styles.body}>Itinerary akan tersedia setelah pendaftaran paket terhubung ke akun Anda.</Text></View>;
}

const styles = StyleSheet.create({
  skeleton: { padding: 22, gap: 20 },
  row: { minHeight: 62, flexDirection: "row", gap: 14 },
  circle: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E8E4DC" },
  lines: { flex: 1, gap: 10, paddingTop: 4 },
  line: { height: 13, borderRadius: 7, backgroundColor: "#E8E4DC" },
  short: { width: "88%", height: 10 },
  state: { flex: 1, padding: 28, alignItems: "center", justifyContent: "center", gap: 9 },
  title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 21, textAlign: "center" },
  body: { maxWidth: 300, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 13.5, lineHeight: 20, textAlign: "center" },
  button: { marginTop: 8, minHeight: 44, paddingHorizontal: 20, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy },
  buttonText: { color: colors.white, fontFamily: "DMSans_700Bold", fontSize: 13.5 },
});
