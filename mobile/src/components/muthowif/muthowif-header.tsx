import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

export function MuthowifHeader({ onSettings }: { onSettings?: () => void }) {
  return <View style={styles.root}><Pressable hitSlop={12} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.white} /></Pressable><Text style={styles.title}>PANEL MUTHOWIF</Text><Pressable hitSlop={12} onPress={onSettings ?? (() => router.push("/muthowif/settings" as never))}><Ionicons name="settings-outline" size={23} color={colors.white} /></Pressable></View>;
}
const styles = StyleSheet.create({ root: { height: 58, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.navy }, title: { color: colors.white, fontFamily: typography.bold, fontSize: 18, letterSpacing: .5 } });
