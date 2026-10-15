import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

export function AccountSkeleton() {
  return <View style={styles.wrap}><View style={styles.card}><View style={[styles.skeleton, styles.avatar]} /><View style={{ flex: 1, gap: 9 }}><View style={[styles.skeleton, { width: "72%", height: 18 }]} /><View style={[styles.skeleton, { width: "54%", height: 12 }]} /></View></View>{Array.from({ length: 6 }, (_, index) => <View key={index} style={styles.row}><View style={[styles.skeleton, styles.icon]} /><View style={[styles.skeleton, { width: `${62 - index * 3}%`, height: 14 }]} /></View>)}</View>;
}

export function AccountError({ onRetry, onLogout }: { onRetry: () => void; onLogout: () => void }) {
  return <View style={styles.error}><Ionicons name="cloud-offline-outline" size={34} color={colors.gold} /><Text style={styles.errorTitle}>Data akun belum dapat dimuat</Text><Text style={styles.errorText}>Periksa koneksi internet Anda, lalu coba kembali.</Text><Pressable onPress={onRetry} style={styles.retry}><Text style={styles.retryText}>Coba Lagi</Text></Pressable><Pressable onPress={onLogout}><Text style={styles.logout}>Keluar dari akun</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  wrap: { marginTop: -51, marginHorizontal: 18, gap: 4 },
  card: { height: 108, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 21, backgroundColor: colors.white },
  skeleton: { borderRadius: 8, backgroundColor: "#EDE9E1" },
  avatar: { width: 62, height: 62, borderRadius: 31 },
  row: { height: 66, flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, backgroundColor: colors.white },
  icon: { width: 40, height: 40, borderRadius: 14 },
  error: { marginTop: -51, marginHorizontal: 18, padding: 22, alignItems: "center", gap: 10, borderRadius: 21, backgroundColor: colors.white },
  errorTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 18, textAlign: "center" },
  errorText: { color: colors.muted, fontFamily: "Montserrat_400Regular", lineHeight: 20, textAlign: "center" },
  retry: { marginTop: 5, minWidth: 130, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.gold },
  retryText: { color: colors.navy, fontFamily: "Montserrat_700Bold" },
  logout: { color: colors.danger, fontFamily: "Montserrat_500Medium", padding: 8 },
});
