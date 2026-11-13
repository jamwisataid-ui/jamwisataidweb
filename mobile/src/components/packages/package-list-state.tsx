import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";

export function EmptyPackageState({ filtered = false }: { filtered?: boolean }) {
  return (
    <View style={styles.state}>
      <GlassSurface variant="pearl" radius={18} style={styles.icon}><Ionicons name="bag-handle-outline" size={27} color={colors.goldDark} /></GlassSurface>
      <Text style={styles.title}>{filtered ? "Belum ada paket di kategori ini" : "Paket sedang diperbarui"}</Text>
      <Text style={styles.body}>Silakan pilih kategori lain atau tarik layar untuk memuat ulang katalog.</Text>
    </View>
  );
}

export function PackageErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.state}>
      <GlassSurface variant="pearl" radius={18} style={styles.icon}><Ionicons name="cloud-offline-outline" size={27} color={colors.goldDark} /></GlassSurface>
      <Text style={styles.title}>Paket belum dapat dimuat</Text>
      <Text style={styles.body}>Periksa koneksi Anda, lalu coba muat kembali.</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={({ pressed }) => pressed && { opacity: 0.72 }}>
        <GlassSurface variant="gold" radius={12} style={styles.retry}>
          <Ionicons name="refresh" size={17} color={colors.navyDeep} />
          <Text style={styles.retryText}>Coba lagi</Text>
        </GlassSurface>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  state: { marginTop: 36, paddingHorizontal: 28, alignItems: "center", gap: 9 },
  icon: { width: 56, height: 56, alignItems: "center", justifyContent: "center" },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 20, textAlign: "center" },
  body: { maxWidth: 300, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 21, textAlign: "center" },
  retry: { minHeight: 42, marginTop: 6, paddingHorizontal: 17, flexDirection: "row", alignItems: "center", gap: 7 },
  retryText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 13 },
});
