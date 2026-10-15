import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DuaCollection, DuaItem } from "@/lib/dua-dhikr";
import { colors } from "@/theme";
import { DuaIconBadge } from "./dua-icon-badge";

export function DuaListItem({ title, subtitle, icon, favorite, onPress }: { title: string; subtitle: string; icon?: DuaCollection["icon"]; favorite?: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}><DuaIconBadge icon={icon} /><View style={styles.copy}><Text style={styles.title}>{title}</Text><Text numberOfLines={2} style={styles.subtitle}>{subtitle}</Text></View>{favorite ? <Ionicons name="bookmark" size={18} color={colors.gold} /> : <Ionicons name="chevron-forward" size={18} color="#9A9FA8" />}</Pressable>;
}

export function DuaContentListItem({ item, favorite, onPress }: { item: DuaItem; favorite?: boolean; onPress: () => void }) {
  return <DuaListItem favorite={favorite} icon={item.kind === "dhikr" ? "sparkles-outline" : "book-outline"} onPress={onPress} subtitle={item.notes || item.translation} title={item.title} />;
}

const styles = StyleSheet.create({ row: { minHeight: 72, marginHorizontal: 18, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 13, borderBottomWidth: 1, borderBottomColor: colors.line }, pressed: { opacity: .62 }, copy: { flex: 1 }, title: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 16 }, subtitle: { marginTop: 3, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12.2, lineHeight: 18 } });
