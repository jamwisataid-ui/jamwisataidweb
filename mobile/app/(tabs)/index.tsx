import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { HighlightCard } from "@/components/home/highlight-card";
import { HomeHeader } from "@/components/home/home-header";
import { PackagePreviewCard, PackagePreviewSkeleton, PACKAGE_PREVIEW_WIDTH } from "@/components/home/package-preview-card";
import { QuickMenuGrid } from "@/components/home/quick-menu-grid";
import { HomeSectionHeader } from "@/components/home/section-header";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";
import type { AccountProfile, Package } from "@/types";
import { FadeInView } from "@/components/motion";

type HomeNotification = { id: string; readAt?: string | null };

export default function HomeScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const user = useAuthStore((state) => state.user);
  const guest = !tokens;
  const packages = useQuery({
    queryKey: ["packages", "umrah"],
    queryFn: () => api<Package[]>("/packages?category=umrah"),
  });
  const profile = useQuery({ queryKey: ["me"], queryFn: () => api<AccountProfile>("/me"), enabled: !guest });
  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api<HomeNotification[]>("/notifications"),
    enabled: !guest,
  });
  const unreadCount = notifications.data?.filter((item) => !item.readAt).length ?? 0;
  const featuredPackages = packages.data?.slice(0, 4) ?? [];

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <HomeHeader name={guest ? null : profile.data?.fullName ?? user?.fullName} unreadCount={unreadCount} guest={guest} />
        <View style={styles.overlap}>
          <FadeInView distance={20}><HighlightCard profile={guest ? undefined : profile.data} packages={packages.data} /></FadeInView>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <HomeSectionHeader title="Layanan Utama" actionLabel="Ibadah" onAction={() => router.push("/(tabs)/worship")} />
            <QuickMenuGrid guest={guest} />
          </View>

          <FadeInView delay={320} style={styles.section}>
            <HomeSectionHeader title="Paket Pilihan" actionLabel="Lihat Semua" onAction={() => router.push("/(tabs)/packages")} />
            {!packages.isPending && featuredPackages.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Paket pilihan sedang diperbarui. Silakan cek kembali beberapa saat lagi.</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={PACKAGE_PREVIEW_WIDTH + 14}
                decelerationRate="fast"
                contentContainerStyle={styles.carousel}
                style={styles.carouselFrame}
              >
                {packages.isPending ? (
                  <>
                    <PackagePreviewSkeleton />
                    <PackagePreviewSkeleton />
                  </>
                ) : (
                  featuredPackages.map((item) => <PackagePreviewCard key={item.id} item={item} />)
                )}
              </ScrollView>
            )}
          </FadeInView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  scroll: { paddingBottom: 32 },
  overlap: { marginTop: -84, paddingHorizontal: 18 },
  content: { paddingHorizontal: 18, paddingTop: 26, gap: 30 },
  section: { gap: 14 },
  carouselFrame: { marginHorizontal: -18 },
  carousel: { paddingHorizontal: 18, gap: 14 },
  empty: { padding: 18, borderRadius: 20, borderWidth: 1, borderColor: colors.goldLine, backgroundColor: colors.white },
  emptyText: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 21, textAlign: "center" },
});
