import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import type { DuaCollection } from "@/lib/dua-dhikr";

export function DuaIconBadge({ icon = "book-outline" }: { icon?: DuaCollection["icon"] }) {
  return <View style={styles.outer}><View style={styles.inner}><Ionicons name={icon} size={21} color={colors.goldDark} /></View></View>;
}

const styles = StyleSheet.create({ outer: { width: 48, height: 48, padding: 3, borderRadius: 14, borderWidth: 1, borderColor: "rgba(214,180,100,0.30)", backgroundColor: "#FDF7EA", shadowColor: "#785F28", shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 3 }, inner: { flex: 1, borderRadius: 11, alignItems: "center", justifyContent: "center" } });
