import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: "home",
  packages: "bag-handle",
  worship: "moon",
  notifications: "notifications",
  account: "person",
};

type TabNotification = { id: string; readAt?: string | null };

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const useLightStatusBar = pathname === "/" || pathname === "/account";
  const tokens = useAuthStore((state) => state.tokens);
  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api<TabNotification[]>("/notifications"),
    enabled: Boolean(tokens),
  });
  const unreadCount = notifications.data?.filter((item) => !item.readAt).length ?? 0;

  return (
    <>
      <StatusBar style={useLightStatusBar ? "light" : "dark"} />
      <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: "#7B8490",
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: colors.white,
          borderTopColor: "#ECE7DE",
          shadowColor: colors.navy,
          shadowOpacity: 0.05,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          elevation: 8,
        },
        tabBarLabelStyle: { fontFamily: "Montserrat_500Medium", fontSize: 11 },
        tabBarIcon: ({ size, focused }) => (
          <Ionicons name={focused ? icons[route.name] : `${icons[route.name]}-outline` as keyof typeof Ionicons.glyphMap} color={focused ? colors.navy : "#7B8490"} size={size} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Beranda" }} />
      <Tabs.Screen name="packages" options={{ title: "Paket" }} />
      <Tabs.Screen name="worship" options={{ title: "Ibadah" }} />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifikasi",
          tabBarBadge: unreadCount > 0 ? (unreadCount > 9 ? "9+" : unreadCount) : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.danger, color: colors.white, fontSize: 9 },
        }}
      />
      <Tabs.Screen name="account" options={{ title: "Akun" }} />
      </Tabs>
    </>
  );
}
