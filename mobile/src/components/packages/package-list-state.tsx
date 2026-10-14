import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";

export function EmptyPackageState({ filtered = false }: { filtered?: boolean }) {
  return (
    <View style={styles.state}>
      <View style={styles.icon}><Ionicons name="bag-handle-outline" size={27} color={colors.gold} /></View>
      <Text style={styles.title}>{filtered ? "Belum ada paket di kategori ini" : "Paket sedang diperbarui"}</Text>
      <Text style={styles.body}>Silakan pilih kategori lain atau tarik layar untuk memuat ulang katalog.</Text>
    </View>
  );
}

export function PackageErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.state}>
      <View style={styles.icon}><Ionicons name="cloud-offline-outline" size={27} color={colors.gold} /></View>
      <Text style={styles.title}>Paket belum dapat dimuat</Text>
      <Text style={styles.body}>Periksa koneksi Anda, lalu coba muat kembali.</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={({ pressed }) => [styles.retry, pressed && { opacity: 0.72 }]}>
        <Ionicons name="refresh" size={17} color={colors.white} />
        <Text style={styles.retryText}>Coba lagi</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  state: { marginTop: 36, paddingHorizontal: 28, alignItems: "center", gap: 9 },
  icon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0D5" },
  title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, textAlign: "center" },
  body: { maxWidth: 300, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 14, lineHeight: 21, textAlign: "center" },
  retry: { minHeight: 42, marginTop: 6, paddingHorizontal: 17, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.navy },
  retryText: { color: colors.white, fontFamily: "DMSans_700Bold", fontSize: 13 },
});
