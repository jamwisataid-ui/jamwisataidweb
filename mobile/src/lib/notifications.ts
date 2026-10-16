import { useEffect } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";

import { api } from "./api";
import { useAuthStore } from "./auth-store";
import { notificationDeepLink } from "./notification-links";

export function useDeviceNotifications() {
  const accessToken = useAuthStore((state) => state.tokens?.accessToken);

  useEffect(() => {
    if (!accessToken || Platform.OS === "web") return;
    let active = true;
    void (async () => {
      if (Platform.OS === "android") await Notifications.setNotificationChannelAsync("informasi-perjalanan", { name: "Informasi perjalanan", importance: Notifications.AndroidImportance.HIGH });
      const current = await Notifications.getPermissionsAsync();
      const permission = current.status === "granted" ? current : await Notifications.requestPermissionsAsync();
      if (!active || permission.status !== "granted") return;
      const token = await Notifications.getDevicePushTokenAsync();
      if (active && typeof token.data === "string") await api("/devices", { method: "POST", body: JSON.stringify({ platform: Platform.OS, pushToken: token.data }) });
    })().catch(() => undefined);
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const deepLink = response.notification.request.content.data?.deepLink;
      const destination = typeof deepLink === "string" ? notificationDeepLink(deepLink) : null;
      if (destination) router.push(destination as never);
    });
    return () => { active = false; subscription.remove(); };
  }, [accessToken]);
}
