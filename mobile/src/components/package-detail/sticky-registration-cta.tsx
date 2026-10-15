import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";

const labels: Record<string, string> = {
  available: "Daftar Sekarang",
  limited: "Daftar · Kursi Terbatas",
  "sold-out": "Kuota Penuh",
  "coming-soon": "Segera Dibuka",
};

export function StickyRegistrationCTA({ status, enabled, onPress }: { status: string; enabled: boolean; onPress: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.frame, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Pressable accessibilityRole="button" disabled={!enabled} onPress={onPress} style={({ pressed }) => [styles.button, !enabled && styles.disabled, pressed && enabled && styles.pressed]}>
        <Text style={styles.label}>{labels[status] || "Pendaftaran Belum Tersedia"}</Text>
        {enabled ? <Ionicons name="arrow-forward" size={19} color={colors.navy} /> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { paddingTop: 11, paddingHorizontal: 18, backgroundColor: "rgba(255,253,248,0.98)", borderTopWidth: 1, borderTopColor: "#EDE7DC" },
  button: { minHeight: 56, borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, backgroundColor: colors.softGold },
  disabled: { backgroundColor: "#DED9D0" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  label: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 16 },
});
