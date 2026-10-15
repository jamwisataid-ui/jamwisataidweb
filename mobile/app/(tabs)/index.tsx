import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HeroBanner } from "@/components/home/hero-banner";
import { HomeHeader } from "@/components/home/home-header";
import { PackagePreviewCard, PackagePreviewSkeleton } from "@/components/home/package-preview-card";
import { QuickMenuGrid } from "@/components/home/quick-menu-grid";
import { HomeSectionHeader } from "@/components/home/section-header";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { colors } from "@/theme";
import type { Package } from "@/types";

type HomeNotification = { id: string; readAt?: string | null };

export default function HomeScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const user = useAuthStore((state) => state.user);
  const packages = useQuery({
    queryKey: ["packages", "umrah"],
    queryFn: () => api<Package[]>("/packages?category=umrah"),
  });
  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api<HomeNotification[]>("/notifications"),
    enabled: Boolean(tokens),
  });
  const unreadCount = notifications.data?.filter((item) => !item.readAt).length ?? 0;
  const featuredPackages = packages.data?.slice(0, 2) ?? [];

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <HomeHeader name={user?.fullName} unreadCount={unreadCount} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HeroBanner />
        <QuickMenuGrid />

        <View style={styles.packageSection}>
          <HomeSectionHeader
            title="Paket Pilihan"
            actionLabel="Lihat Semua"
            onAction={() => router.push("/(tabs)/packages")}
          />
          {packages.isPending ? <PackagePreviewSkeleton /> : null}
          {featuredPackages.map((item) => <PackagePreviewCard key={item.id} item={item} />)}
          {!packages.isPending && featuredPackages.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Paket pilihan sedang diperbarui. Silakan cek kembali beberapa saat lagi.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: "#0A1D3A" },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 34, gap: 25, backgroundColor: colors.ivory },
  packageSection: { gap: 13 },
  empty: { padding: 18, borderRadius: 18, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  emptyText: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 21, textAlign: "center" },
});
