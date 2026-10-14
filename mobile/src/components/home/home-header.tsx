import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { NotificationBadge } from "./notification-badge";

export function HomeHeader({ name, unreadCount }: { name?: string | null; unreadCount: number }) {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <View style={styles.greetingBlock}>
          <Text style={styles.eyebrow}>Assalamu&apos;alaikum</Text>
          <Text numberOfLines={1} style={styles.greeting}>
            {name ? `Halo, ${name}` : "Selamat Datang 👋"}
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Buka notifikasi"
          accessibilityRole="button"
          onPress={() => router.push("/(tabs)/notifications")}
          style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
        >
          <Ionicons name="notifications-outline" size={23} color="#FFFFFF" />
          <NotificationBadge count={unreadCount} />
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="search"
        onPress={() => router.push("/search")}
        style={({ pressed }) => [styles.search, pressed && styles.searchPressed]}
      >
        <Ionicons name="search-outline" size={20} color="#657184" />
        <Text numberOfLines={1} style={styles.searchText}>
          Cari paket umroh, hotel, atau informasi...
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00365F",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 18,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 16 },
  greetingBlock: { flex: 1, gap: 3 },
  eyebrow: { color: "rgba(255,255,255,0.78)", fontFamily: "DMSans_400Regular", fontSize: 13 },
  greeting: { color: "#FFFFFF", fontFamily: "DMSans_700Bold", fontSize: 22, lineHeight: 28 },
  bell: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  pressed: { opacity: 0.72 },
  search: {
    minHeight: 47,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
  },
  searchPressed: { backgroundColor: "#F5F2EB" },
  searchText: { flex: 1, color: "#788191", fontFamily: "DMSans_400Regular", fontSize: 14 },
});
