import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

export function LiveSkeleton() {
  return <View style={styles.stack}>{[0, 1, 2].map((item) => <View key={item} style={styles.skeleton}><View style={styles.skeletonImage} /><View style={styles.skeletonCopy}><View style={[styles.line, { width: "38%" }]} /><View style={[styles.line, { width: "82%", height: 17 }]} /><View style={[styles.line, { width: "62%" }]} /><View style={[styles.line, { width: "72%" }]} /></View></View>)}</View>;
}

export function LiveEmptyState({ scheduled, onSchedule }: { scheduled: boolean; onSchedule: () => void }) {
  return <View style={styles.state}><View style={styles.icon}><Ionicons name={scheduled ? "calendar-outline" : "radio-outline"} size={28} color={colors.goldDark} /></View><Text style={styles.title}>{scheduled ? "Belum ada jadwal siaran" : "Belum ada siaran aktif"}</Text><Text style={styles.copy}>Jadwal panduan akan muncul sesuai agenda rombongan Anda.</Text>{!scheduled ? <Pressable onPress={onSchedule} style={styles.retry}><Text style={styles.retryText}>Lihat Jadwal Siaran</Text></Pressable> : null}</View>;
}

export function LiveErrorState({ onRetry }: { onRetry: () => void }) {
  return <View style={styles.state}><View style={styles.icon}><Ionicons name="cloud-offline-outline" size={28} color={colors.goldDark} /></View><Text style={styles.title}>Sesi Live Muthowif belum dapat dimuat.</Text><Text style={styles.copy}>Periksa koneksi internet Anda, lalu coba kembali.</Text><Pressable onPress={onRetry} style={styles.retry}><Text style={styles.retryText}>Coba Lagi</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  stack: { gap: 14 },
  skeleton: { height: 188, padding: 13, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, flexDirection: "row", gap: 13 },
  skeletonImage: { width: 104, height: 128, borderRadius: 13, backgroundColor: "#EEEAE0" },
  skeletonCopy: { flex: 1, paddingTop: 4, gap: 10 },
  line: { height: 12, borderRadius: 8, backgroundColor: "#EEEAE0" },
  state: { alignItems: "center", paddingHorizontal: 28, paddingVertical: 46 },
  icon: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.goldPale, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  title: { color: colors.navy, fontFamily: typography.bold, fontSize: 17, textAlign: "center" },
  copy: { marginTop: 7, color: colors.muted, fontFamily: typography.body, fontSize: 13, lineHeight: 20, textAlign: "center" },
  retry: { marginTop: 18, minHeight: 42, justifyContent: "center", paddingHorizontal: 18, borderRadius: 11, backgroundColor: colors.navy },
  retryText: { color: colors.white, fontFamily: typography.bold, fontSize: 13 },
});
