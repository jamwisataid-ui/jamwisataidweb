import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadow } from "@/theme";
import { MetallicGold } from "@/components/metallic-gold";
import { GlassSurface } from "@/components/glass";

export function RegistrationFooter({ label, onPress, onBack, busy, disabled }: { label: string; onPress: () => void; onBack?: () => void; busy?: boolean; disabled?: boolean }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 12) }]}>{onBack ? <Pressable accessibilityRole="button" accessibilityLabel="Langkah sebelumnya" onPress={onBack}><GlassSurface variant="dark" radius={12} style={styles.back}><Ionicons name="chevron-back" size={20} color={colors.softGold} /></GlassSurface></Pressable> : null}<Pressable accessibilityRole="button" disabled={busy || disabled} onPress={onPress} style={({ pressed }) => [styles.primary, (pressed || disabled) && { opacity: .62 }]}><MetallicGold style={styles.primaryFill}>{busy ? <ActivityIndicator color={colors.navy} /> : <><Text style={styles.text}>{label.toLocaleUpperCase("id-ID")}</Text><Ionicons name="arrow-forward" size={18} color={colors.navyDeep} /></>}</MetallicGold></Pressable></View>;
}

const styles = StyleSheet.create({ root: { flexDirection: "row", gap: 10, paddingTop: 12, paddingHorizontal: 20, backgroundColor: "rgba(255,255,255,0.97)", borderTopWidth: 1, borderTopColor: "rgba(184,134,11,0.25)", ...shadow }, back: { width: 54, height: 54, borderRadius: 12, alignItems: "center", justifyContent: "center" }, primary: { flex: 1, height: 54, borderRadius: 12 }, primaryFill: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, borderRadius: 12 }, text: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 14.5, letterSpacing: 0.8 } });
