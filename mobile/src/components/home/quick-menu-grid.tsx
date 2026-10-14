import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

const items: Array<{ label: string; icon: IconName; href: string }> = [
  { label: "Paket Umroh", icon: "airplane-outline", href: "/(tabs)/packages" },
  { label: "Jadwal Keberangkatan", icon: "calendar-outline", href: "/schedule" },
  { label: "Panduan Ibadah", icon: "compass-outline", href: "/(tabs)/worship" },
  { label: "Jadwal Sholat", icon: "time-outline", href: "/prayer-times" },
  { label: "Mushaf Qur'an", icon: "book-outline", href: "/quran" },
  { label: "Doa & Dzikir", icon: "sparkles-outline", href: "/duas" },
  { label: "Dokumen Jamaah", icon: "document-text-outline", href: "/documents" },
  { label: "LIVE MUTHOWIF", icon: "radio-outline", href: "/live-muthowif" },
];

function QuickMenuItem({ label, icon, href }: (typeof items)[number]) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(href as never)}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={24} color="#00365F" />
        <View style={styles.accent} />
      </View>
      <Text numberOfLines={2} style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export function QuickMenuGrid() {
  return <View style={styles.grid}>{items.map((item) => <QuickMenuItem key={item.label} {...item} />)}</View>;
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: 18 },
  item: { width: "25%", alignItems: "center", gap: 8, paddingHorizontal: 3 },
  pressed: { opacity: 0.66, transform: [{ scale: 0.97 }] },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF2D8",
    borderWidth: 1,
    borderColor: "#F4DFC0",
  },
  accent: { position: "absolute", right: 8, top: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: "#E39B33" },
  label: { minHeight: 31, color: "#102D4B", fontFamily: "DMSans_500Medium", fontSize: 11.5, lineHeight: 15, textAlign: "center" },
});
