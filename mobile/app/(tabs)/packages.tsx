import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PackageCard, PackageCardSkeleton } from "@/components/packages/package-card";
import { PackageFilterTabs, type PackageFilter } from "@/components/packages/package-filter-tabs";
import { EmptyPackageState, PackageErrorState } from "@/components/packages/package-list-state";
import { api } from "@/lib/api";
import { colors } from "@/theme";
import type { Package } from "@/types";

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

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.appBar}>
        <Pressable accessibilityLabel="Kembali" accessibilityRole="button" onPress={goBack} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={23} color={colors.navy} />
        </Pressable>
        <Text style={styles.title}>Paket Umroh</Text>
        <Pressable accessibilityLabel="Cari paket" accessibilityRole="button" onPress={() => router.push("/search")} style={styles.iconButton}>
          <Ionicons name="search" size={23} color={colors.navy} />
        </Pressable>
      </View>

      <View style={styles.filterFrame}><PackageFilterTabs value={filter} onChange={setFilter} /></View>

      {query.isError ? (
        <PackageErrorState onRetry={() => void query.refetch()} />
      ) : (
        <FlatList
          data={packages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PackageCard item={item} />}
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
  appBar: { minHeight: 58, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.ivory },
  iconButton: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 22 },
  filterFrame: { borderBottomWidth: 1, borderBottomColor: "#EEE8DE" },
  list: { paddingHorizontal: 18, paddingTop: 17, paddingBottom: 34 },
  emptyList: { flexGrow: 1 },
  separator: { height: 17 },
  skeletons: { gap: 17 },
});
