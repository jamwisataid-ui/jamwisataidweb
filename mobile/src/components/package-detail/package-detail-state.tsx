import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { colors } from "@/theme";

export function PackageDetailSkeleton() {
  return <View style={styles.skeletonRoot}><View style={styles.hero} /><View style={styles.skeletonCard}><View style={[styles.line, { width: "74%", height: 22 }]} /><View style={[styles.line, { width: "55%" }]} /><View style={[styles.line, { width: "48%", height: 38, marginTop: 7 }]} /></View><View style={styles.tabLine} />{Array.from({ length: 5 }, (_, index) => <View key={index} style={styles.row}><View style={styles.circle} /><View style={[styles.line, { flex: 1 }]} /></View>)}</View>;
}

export function PackageDetailError({ onRetry }: { onRetry: () => void }) {
  return <View style={styles.errorRoot}><Pressable accessibilityLabel="Kembali" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><View style={styles.errorCard}><Ionicons name="cloud-offline-outline" size={34} color={colors.gold} /><Text style={styles.errorTitle}>Paket tidak dapat dimuat</Text><Text style={styles.errorBody}>Periksa koneksi internet Anda.</Text><Pressable onPress={onRetry} style={styles.retry}><Text style={styles.retryText}>Coba Lagi</Text></Pressable></View></View>;
}

const styles = StyleSheet.create({
  skeletonRoot: { flex: 1, gap: 18, backgroundColor: colors.ivory }, hero: { height: 290, backgroundColor: "#E1E5E5" },
  skeletonCard: { marginHorizontal: 18, marginTop: -46, padding: 20, borderRadius: 22, gap: 12, backgroundColor: colors.white },
  line: { height: 13, borderRadius: 7, backgroundColor: "#E7E3DC" }, tabLine: { height: 48, marginHorizontal: 18, borderBottomWidth: 3, borderBottomColor: "#E7E3DC" },
  row: { marginHorizontal: 18, flexDirection: "row", alignItems: "center", gap: 12 }, circle: { width: 31, height: 31, borderRadius: 10, backgroundColor: "#E7E3DC" },
  errorRoot: { flex: 1, padding: 18, backgroundColor: colors.ivory }, back: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  errorCard: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }, errorTitle: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 23 },
  errorBody: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 14 }, retry: { marginTop: 8, minHeight: 44, paddingHorizontal: 20, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }, retryText: { color: colors.white, fontFamily: "DMSans_700Bold" },
});
