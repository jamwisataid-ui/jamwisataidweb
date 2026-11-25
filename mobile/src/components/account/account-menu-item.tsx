import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

export function AccountMenuItem({ icon, title, subtitle, badge, danger, onPress, last }: { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string; badge?: number; danger?: boolean; onPress: () => void; last?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, last && styles.last, pressed && styles.pressed]}><View style={[styles.icon, danger && styles.dangerIcon]}><Ionicons name={icon} size={19} color={danger ? colors.danger : colors.goldDark} /></View><View style={styles.copy}><Text style={[styles.title, danger && styles.danger]}>{title}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</View>{badge ? <View style={styles.badge}><Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text></View> : null}{!danger ? <Ionicons name="chevron-forward" size={17} color={colors.goldDark} /> : null}</Pressable>;
}

const styles = StyleSheet.create({
  row: { minHeight: 64, marginLeft: 16, paddingRight: 16, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: "rgba(201,151,31,0.14)" },
  last: { borderBottomWidth: 0 },
  pressed: { opacity: .62 },
  icon: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, borderColor: "rgba(214,180,100,0.30)", backgroundColor: "#FDF7EA", shadowColor: "#785F28", shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 3, alignItems: "center", justifyContent: "center" },
  dangerIcon: { borderColor: "rgba(180,35,24,0.3)" },
  copy: { flex: 1, gap: 2 },
  title: { color: colors.navy, fontFamily: "Montserrat_600SemiBold", fontSize: 14.5 },
  subtitle: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12 },
  danger: { color: colors.danger },
  badge: { minWidth: 23, height: 23, paddingHorizontal: 6, borderRadius: 12, backgroundColor: colors.gold, alignItems: "center", justifyContent: "center" },
  badgeText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 10 },
});
