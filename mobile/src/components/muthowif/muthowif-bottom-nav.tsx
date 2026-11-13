import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/theme";
import { GlassSurface } from "@/components/glass";

type Tab = "home" | "live" | "jamaah" | "settings";
const items: Array<{ id: Tab; label: string; icon: keyof typeof Ionicons.glyphMap; href: string }> = [{ id: "home", label: "Beranda", icon: "home-outline", href: "/muthowif" }, { id: "live", label: "Live", icon: "radio-outline", href: "/muthowif/live" }, { id: "jamaah", label: "Jamaah", icon: "people-outline", href: "/muthowif/jamaah" }, { id: "settings", label: "Pengaturan", icon: "settings-outline", href: "/muthowif/settings" }];
export function MuthowifBottomNav({ active }: { active: Tab }) { return <GlassSurface variant="dark" radius={0} style={styles.root}>{items.map((item) => { const selected = active === item.id; const content = <><Ionicons name={selected ? item.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap : item.icon} size={21} color={selected ? colors.navyDeep : "rgba(255,255,255,0.76)"} /><Text style={[styles.label, selected && styles.activeLabel]}>{item.label}</Text></>; return <Pressable key={item.id} onPress={() => router.replace(item.href as never)} style={styles.item}>{selected ? <GlassSurface variant="gold" radius={13} style={styles.active}>{content}</GlassSurface> : content}</Pressable>; })}</GlassSurface>; }
const styles = StyleSheet.create({ root: { minHeight: 70, paddingHorizontal: 8, paddingTop: 7, paddingBottom: 5, flexDirection: "row" }, item: { flex: 1, minHeight: 54, alignItems: "center", justifyContent: "center", gap: 3, borderRadius: 13 }, active: { width: "100%", minHeight: 54, alignItems: "center", justifyContent: "center", gap: 3 }, label: { color: "rgba(255,255,255,0.76)", fontFamily: typography.medium, fontSize: 10 }, activeLabel: { color: colors.navyDeep, fontFamily: typography.bold } });
