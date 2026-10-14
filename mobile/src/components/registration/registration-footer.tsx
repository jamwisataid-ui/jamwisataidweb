import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, shadow } from "@/theme";

export function RegistrationFooter({ label, onPress, onBack, busy, disabled }: { label: string; onPress: () => void; onBack?: () => void; busy?: boolean; disabled?: boolean }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 12) }]}>{onBack ? <Pressable accessibilityRole="button" onPress={onBack} style={styles.back}><Ionicons name="arrow-back" size={20} color={colors.navy} /></Pressable> : null}<Pressable accessibilityRole="button" disabled={busy || disabled} onPress={onPress} style={({ pressed }) => [styles.primary, (pressed || disabled) && { opacity: .62 }]}>{busy ? <ActivityIndicator color={colors.navy} /> : <><Text style={styles.text}>{label}</Text><Ionicons name="arrow-forward" size={19} color={colors.navy} /></>}</Pressable></View>;
}

const styles = StyleSheet.create({ root: { flexDirection: "row", gap: 10, paddingTop: 11, paddingHorizontal: 18, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, ...shadow }, back: { width: 54, height: 56, borderRadius: 16, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" }, primary: { flex: 1, height: 56, borderRadius: 16, backgroundColor: colors.softGold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 }, text: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 16 } });
