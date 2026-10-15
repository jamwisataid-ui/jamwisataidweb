import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";

type Tab = "home" | "live" | "jamaah" | "settings";
const items: Array<{ id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap; href: string }> = [{ id: "home", label: "Beranda", icon: "home-outline", href: "/muthowif" }, { id: "live", label: "Live", icon: "radio-outline", href: "/muthowif/live" }, { id: "jamaah", label: "Jamaah", icon: "people-outline", href: "/muthowif/jamaah" }, { id: "settings", label: "Pengaturan", icon: "settings-outline", href: "/muthowif/settings" }];
export function MuthowifBottomNav({ active }: { active: Tab }) { return <View style={styles.root}>{items.map((item) => { const selected = active === item.id; return <Pressable key={item.id} onPress={() => router.replace(item.href as never)} style={[styles.item, selected && styles.active]}><Ionicons name={selected ? item.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap : item.icon} size={21} color={selected ? colors.gold : colors.muted} /><Text style={[styles.label, selected && styles.activeLabel]}>{item.label}</Text></Pressable>; })}</View>; }
const styles = StyleSheet.create({ root: { minHeight: 66, paddingHorizontal: 8, paddingTop: 7, paddingBottom: 5, flexDirection: "row", backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line }, item: { flex: 1, alignItems: "center", justifyContent: "center", gap: 3, borderRadius: 13 }, active: { backgroundColor: colors.navy }, label: { color: colors.muted, fontFamily: typography.medium, fontSize: 10 }, activeLabel: { color: colors.white, fontFamily: typography.bold } });
