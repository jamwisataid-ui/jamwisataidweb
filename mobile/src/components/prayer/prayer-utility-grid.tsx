import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";

type Utility = { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void };

export function PrayerUtilityGrid({ items }: { items: Utility[] }) {
  return <View style={styles.root}>{items.map((item) => <Pressable accessibilityRole="button" key={item.label} onPress={item.onPress} style={({ pressed }) => [styles.item, pressed && styles.pressed]}><GlassSurface variant="pearl" radius={24} style={styles.icon}><Ionicons name={item.icon} size={23} color={colors.navy} /></GlassSurface><Text style={styles.label}>{item.label}</Text></Pressable>)}</View>;
}

const styles = StyleSheet.create({ root: { marginHorizontal: 18, marginTop: 25, paddingTop: 20, flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.line }, item: { flex: 1, minHeight: 82, alignItems: "center", gap: 8, paddingHorizontal: 4 }, pressed: { opacity: .65 }, icon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" }, label: { maxWidth: 105, color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 11.5, lineHeight: 15, textAlign: "center" } });
