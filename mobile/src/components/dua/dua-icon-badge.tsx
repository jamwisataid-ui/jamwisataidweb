import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import type { DuaCollection } from "@/lib/dua-dhikr";

export function DuaIconBadge({ icon = "book-outline" }: { icon?: DuaCollection["icon"] }) {
  return <View style={styles.outer}><View style={styles.inner}><Ionicons name={icon} size={21} color={colors.navy} /></View></View>;
}

const styles = StyleSheet.create({ outer: { width: 48, height: 48, padding: 3, borderRadius: 24, borderWidth: 1.5, borderColor: colors.gold, backgroundColor: "#FFF8E8" }, inner: { flex: 1, borderRadius: 20, borderWidth: 1, borderColor: "#F2CB86", alignItems: "center", justifyContent: "center" } });
