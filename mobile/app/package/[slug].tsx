import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PackageDetailContent } from "@/components/package-detail/package-detail-content";
import { PackageDetailError, PackageDetailSkeleton } from "@/components/package-detail/package-detail-state";
import { PackageDetailTabs, type DetailTab } from "@/components/package-detail/package-detail-tabs";
import { PackageHero } from "@/components/package-detail/package-hero";
import { PackageDeparturePicker } from "@/components/package-detail/package-departure-picker";
import { PackageSummaryCard } from "@/components/package-detail/package-summary-card";
import { StickyRegistrationCTA } from "@/components/package-detail/sticky-registration-cta";
import { api } from "@/lib/api";
import { colors } from "@/theme";
import type { Package } from "@/types";

export default function PackageDetailScreen() {
  const params = useLocalSearchParams<{ slug: string | string[]; departureId?: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const requestedDepartureId = Array.isArray(params.departureId) ? params.departureId[0] : params.departureId;
  const [tab, setTab] = useState<DetailTab>("detail");
  const [favorite, setFavorite] = useState(false);
  const [selectedDepartureId, setSelectedDepartureId] = useState(requestedDepartureId ?? "");
  const query = useQuery({
    queryKey: ["package", slug],
    queryFn: () => api<Package>(`/packages/${encodeURIComponent(slug!)}`),
    enabled: Boolean(slug),
  });
  const item = query.data;

  if (query.isPending) return <SafeAreaView edges={[]} style={styles.safe}><PackageDetailSkeleton /></SafeAreaView>;
  if (query.isError || !item) return <SafeAreaView style={styles.safe}><PackageDetailError onRetry={() => void query.refetch()} /></SafeAreaView>;

  const departures = item.departures ?? [];
  const automaticDepartureId = departures.filter((departure) => departure.selectable).length === 1 ? departures.find((departure) => departure.selectable)?.id ?? "" : "";
  const effectiveDepartureId = selectedDepartureId || automaticDepartureId || (!departures.length ? item.departureId ?? "" : "");
  const selectedDeparture = departures.find((departure) => departure.id === effectiveDepartureId);
  const canRegister = Boolean(effectiveDepartureId) && (selectedDeparture ? selectedDeparture.selectable : item.status === "available" || item.status === "limited");

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PackageHero item={item} favorite={favorite} onToggleFavorite={() => setFavorite((value) => !value)} />
        <PackageSummaryCard item={item} price={selectedDeparture?.price ?? item.priceFrom} />
        <PackageDeparturePicker departures={departures} value={effectiveDepartureId} onChange={setSelectedDepartureId} />
        <PackageDetailTabs value={tab} onChange={setTab} />
        <PackageDetailContent item={item} tab={tab} />
      </ScrollView>
      <StickyRegistrationCTA status={selectedDeparture?.status ?? item.status} enabled={canRegister} onPress={() => effectiveDepartureId && router.push(`/register/${effectiveDepartureId}`)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: "#FBFAF6" },
  content: { paddingBottom: 28, backgroundColor: colors.ivory },
});
