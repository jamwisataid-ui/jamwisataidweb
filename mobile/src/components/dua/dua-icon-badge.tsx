import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "@/theme";
import type { DuaCollection } from "@/lib/dua-dhikr";
import { GlassSurface } from "@/components/glass";

export function DuaIconBadge({ icon = "book-outline" }: { icon?: DuaCollection["icon"] }) {
  return <GlassSurface variant="pearl" radius={24} style={styles.outer}><View style={styles.inner}><Ionicons name={icon} size={21} color={colors.navy} /></View></GlassSurface>;
}

const styles = StyleSheet.create({ outer: { width: 48, height: 48, padding: 3, borderRadius: 24 }, inner: { flex: 1, borderRadius: 20, borderWidth: 1, borderColor: "#E8C967", alignItems: "center", justifyContent: "center" } });
