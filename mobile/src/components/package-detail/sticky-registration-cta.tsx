import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme";
import { MetallicGold } from "@/components/metallic-gold";

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
        {enabled ? <MetallicGold style={styles.buttonFill}><Text style={styles.label}>{labels[status] || "Pendaftaran Belum Tersedia"}</Text><Ionicons name="arrow-forward" size={18} color={colors.navyDeep} /></MetallicGold> : <Text style={styles.label}>{labels[status] || "Pendaftaran Belum Tersedia"}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { paddingTop: 12, paddingHorizontal: 20, backgroundColor: "rgba(255,255,255,0.97)", borderTopWidth: 1, borderTopColor: "rgba(184,134,11,0.25)" },
  button: { minHeight: 56, borderRadius: 12, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  buttonFill: { position: "absolute", inset: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,236,170,0.55)" },
  disabled: { backgroundColor: "#DED9D0" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  label: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 15, letterSpacing: 0.6 },
});
