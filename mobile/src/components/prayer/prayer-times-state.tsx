import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";

export function PrayerTimesState({ loading, onRetry }: { loading: boolean; onRetry: () => void }) {
  if (loading) return <View style={styles.skeleton}><View style={styles.dateLine} /><View style={styles.dateLineSmall} />{Array.from({ length: 6 }, (_, index) => <View key={index} style={styles.row}><View style={styles.icon} /><View style={styles.name} /><View style={styles.time} /></View>)}<View style={styles.shortcuts}>{Array.from({ length: 3 }, (_, index) => <View key={index} style={styles.shortcut} />)}</View></View>;
  return <View style={styles.error}><Ionicons name="cloud-offline-outline" size={36} color={colors.gold} /><Text style={styles.errorTitle}>Jadwal sholat tidak dapat dimuat</Text><Text style={styles.errorBody}>Periksa koneksi internet Anda.</Text><Pressable onPress={onRetry} style={styles.retry}><Text style={styles.retryText}>Coba Lagi</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  skeleton: { paddingHorizontal: 20, paddingTop: 25 }, dateLine: { width: 190, height: 14, alignSelf: "center", borderRadius: 7, backgroundColor: "#E7E3DC" }, dateLineSmall: { width: 130, height: 11, marginTop: 8, marginBottom: 18, alignSelf: "center", borderRadius: 6, backgroundColor: "#E7E3DC" },
  row: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: "#EEE9DF" }, icon: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#E7E3DC" }, name: { width: 92, height: 13, borderRadius: 7, backgroundColor: "#E7E3DC" }, time: { width: 48, height: 13, marginLeft: "auto", borderRadius: 7, backgroundColor: "#E7E3DC" },
  shortcuts: { marginTop: 26, flexDirection: "row", justifyContent: "space-around" }, shortcut: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#E7E3DC" },
  error: { flex: 1, padding: 28, alignItems: "center", justifyContent: "center", gap: 9 }, errorTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 21, textAlign: "center" }, errorBody: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13.5 }, retry: { marginTop: 8, minHeight: 44, paddingHorizontal: 20, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }, retryText: { color: colors.white, fontFamily: "Montserrat_700Bold", fontSize: 13.5 },
});
