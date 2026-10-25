import { useEffect } from "react";
import { Linking, Platform } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { router } from "expo-router";

import { api } from "./api";
import { useAuthStore } from "./auth-store";
import { notificationDeepLink, notificationDownloadUrl } from "./notification-links";

export function useDeviceNotifications() {
  const accessToken = useAuthStore((state) => state.tokens?.accessToken);

  useEffect(() => {
    if (!accessToken || Platform.OS === "web" || Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return;
    let active = true;
    let subscription: { remove: () => void } | undefined;
    void (async () => {
      const Notifications = await import("expo-notifications");
      if (!active) return;
      if (Platform.OS === "android") await Notifications.setNotificationChannelAsync("informasi-perjalanan", { name: "Informasi perjalanan", importance: Notifications.AndroidImportance.HIGH });
      const current = await Notifications.getPermissionsAsync();
      const permission = current.status === "granted" ? current : await Notifications.requestPermissionsAsync();
      if (!active || permission.status !== "granted") return;
      const token = await Notifications.getDevicePushTokenAsync();
      if (active && typeof token.data === "string") await api("/devices", { method: "POST", body: JSON.stringify({ platform: Platform.OS, pushToken: token.data }) });
      if (!active) return;
      subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        const deepLink = response.notification.request.content.data?.deepLink;
        const destination = typeof deepLink === "string" ? notificationDeepLink(deepLink) : null;
        if (destination) router.push(destination as never);
        else if (typeof deepLink === "string") {
          const downloadUrl = notificationDownloadUrl(deepLink);
          if (downloadUrl) void Linking.openURL(downloadUrl);
        }
      });
    })().catch(() => undefined);
    return () => { active = false; subscription?.remove(); };
  }, [accessToken]);
}
