import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import headerImage from "../../assets/home/v3/beranda-header.jpg";
import { HighlightCarousel } from "@/components/home/highlight-card";
import { HomeHeader } from "@/components/home/home-header";
import { QuickMenuGrid, SERVICES_HEIGHT } from "@/components/home/quick-menu-grid";
import { FadeInView } from "@/components/motion";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";
import type { AccountProfile, Package } from "@/types";

type HomeNotification = { id: string; readAt?: string | null };

/** Header photo ratio (898×789). */
const HEADER_RATIO = 789 / 898;
/** Artboard y of the services card; the whole Beranda fits one screen without scrolling. */
const SERVICES_TOP = 461;
const CARD_TOP = 249;

export default function HomeScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const user = useAuthStore((state) => state.user);
  const guest = !tokens;
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [sceneHeight, setSceneHeight] = useState(windowHeight - 80 - insets.bottom);
  const width = Math.min(windowWidth, 480);

  const packages = useQuery({ queryKey: ["packages", "umrah"], queryFn: () => api<Package[]>("/packages?category=umrah") });
  const profile = useQuery({ queryKey: ["me"], queryFn: () => api<AccountProfile>("/me"), enabled: !guest });
  const notifications = useQuery({ queryKey: ["notifications"], queryFn: () => api<HomeNotification[]>("/notifications"), enabled: !guest });
  const unreadCount = notifications.data?.filter((item) => !item.readAt).length ?? 0;

  // Elements keep their size; only the sky above the logo flexes (logo 8–45pt below the safe area).
  const contentBottom = SERVICES_TOP + SERVICES_HEIGHT + 14;
  const top = Math.max(insets.top + 8 - 92, Math.min(insets.top + 45 - 92, sceneHeight - contentBottom));

  return (
    <View style={styles.root} onLayout={(event) => setSceneHeight(event.nativeEvent.layout.height)}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: sceneHeight }}>
        <View style={{ height: top + contentBottom }}>
          <Image alt="" source={headerImage} resizeMode="cover" style={[styles.headerImage, { top: Math.min(top, 0), height: width * HEADER_RATIO + Math.max(top, 0) }]} />
          <HomeHeader top={top} guest={guest} name={profile.data?.fullName ?? user?.fullName} unreadCount={unreadCount} verified={Boolean(profile.data?.jamaahNumber)} />
          <FadeInView distance={16} style={[styles.card, { top: top + CARD_TOP }]}>
            <HighlightCarousel packages={packages.data} width={width - 28} />
          </FadeInView>
          <View style={[styles.services, { top: top + SERVICES_TOP }]}>
            <QuickMenuGrid guest={guest} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  headerImage: { position: "absolute", left: 0, right: 0, width: "100%", backgroundColor: "#031430" },
  card: { position: "absolute", left: 14, right: 14 },
  services: { position: "absolute", left: 10, right: 10 },
});
