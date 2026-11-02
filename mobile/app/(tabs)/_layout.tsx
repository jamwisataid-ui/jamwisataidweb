import { Tabs, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";

import { LuxuryTabBar } from "@/components/tab-bar";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";

type TabNotification = { id: string; readAt?: string | null };

export default function TabLayout() {
  const pathname = usePathname();
  const useLightStatusBar = pathname === "/" || pathname === "/account" || pathname === "/worship";
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
        tabBar={(props) => <LuxuryTabBar {...props} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.ivory } }}
      >
        <Tabs.Screen name="index" options={{ title: "Beranda" }} />
        <Tabs.Screen name="packages" options={{ title: "Paket" }} />
        <Tabs.Screen name="worship" options={{ title: "Ibadah" }} />
        <Tabs.Screen
          name="notifications"
          options={{ title: "Notifikasi", tabBarBadge: unreadCount > 0 ? (unreadCount > 9 ? "9+" : unreadCount) : undefined }}
        />
        <Tabs.Screen name="account" options={{ title: "Akun" }} />
      </Tabs>
    </>
  );
}
