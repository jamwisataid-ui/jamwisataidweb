import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PackageCard, PackageCardSkeleton } from "@/components/packages/package-card";
import { PackageFilterTabs, type PackageFilter } from "@/components/packages/package-filter-tabs";
import { EmptyPackageState, PackageErrorState } from "@/components/packages/package-list-state";
import { CircleButton, Eyebrow } from "@/components/ui";
import { api } from "@/lib/api";
import { colors } from "@/theme";
import type { Package } from "@/types";
import { FadeInView } from "@/components/motion";

function matchesFilter(item: Package, filter: PackageFilter) {
  if (filter === "all") return true;
  if (filter === "plus") return item.packageType === "plus";
  if (filter === "regular") return item.packageType === "reguler" || item.packageType === "bintang-5";
  const searchable = `${item.name} ${item.badge || ""}`.toLocaleLowerCase("id-ID");
  return searchable.includes("ramadhan") || searchable.includes("ramadan");
}

export default function PackageListScreen() {
  const [filter, setFilter] = useState<PackageFilter>("all");
  const query = useQuery({ queryKey: ["packages", "umrah"], queryFn: () => api<Package[]>("/packages?category=umrah") });
  const packages = useMemo(() => (query.data ?? []).filter((item) => matchesFilter(item, filter)), [filter, query.data]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Eyebrow>KOLEKSI PERJALANAN</Eyebrow>
          <Text accessibilityRole="header" style={styles.title}>Paket Umroh</Text>
        </View>
        <CircleButton icon="search-outline" label="Cari paket" onPress={() => router.push("/search")} />
      </View>

      <View style={styles.filterFrame}><PackageFilterTabs value={filter} onChange={setFilter} /></View>

      {query.isError ? (
        <PackageErrorState onRetry={() => void query.refetch()} />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <FadeInView delay={Math.min(index, 5) * 70}><PackageCard item={item} /></FadeInView>}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={query.isPending ? <View style={styles.skeletons}><PackageCardSkeleton /><PackageCardSkeleton /></View> : <EmptyPackageState filtered={filter !== "all"} />}
          contentContainerStyle={[styles.list, !query.isPending && packages.length === 0 && styles.emptyList]}
          refreshControl={<RefreshControl refreshing={query.isRefetching && !query.isPending} onRefresh={() => void query.refetch()} tintColor={colors.navy} colors={[colors.navy]} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  headerCopy: { flex: 1, gap: 4 },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 28, lineHeight: 34 },
  filterFrame: { paddingTop: 4 },
  list: { paddingHorizontal: 18, paddingTop: 17, paddingBottom: 34 },
  emptyList: { flexGrow: 1 },
  separator: { height: 16 },
  skeletons: { gap: 17 },
});
