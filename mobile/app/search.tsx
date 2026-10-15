import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { PackagePreviewCard, PackagePreviewSkeleton } from "@/components/home/package-preview-card";
import { Screen } from "@/components/ui";
import { api } from "@/lib/api";
import { colors } from "@/theme";
import type { Package } from "@/types";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const packages = useQuery({ queryKey: ["packages", "umrah"], queryFn: () => api<Package[]>("/packages?category=umrah") });
  const results = useMemo(() => {
    const value = keyword.trim().toLocaleLowerCase("id-ID");
    if (!value) return packages.data ?? [];
    return (packages.data ?? []).filter((item) => [
      item.name,
      item.airline,
      item.category,
      item.packageType,
      item.makkahHotel?.name,
      item.madinahHotel?.name,
      ...(item.destination ?? []),
      ...(item.plusHotels ?? []).flatMap((hotel) => [hotel.destination, hotel.name]),
    ]
      .filter(Boolean)
      .some((field) => String(field).toLocaleLowerCase("id-ID").includes(value)));
  }, [keyword, packages.data]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Kembali" accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={23} color={colors.navy} />
        </Pressable>
        <View style={styles.heading}>
          <Text style={styles.title}>Cari perjalanan</Text>
          <Text style={styles.subtitle}>Temukan paket, tujuan, maskapai, atau hotel.</Text>
        </View>
      </View>
      <View style={styles.search}>
        <Ionicons name="search-outline" size={20} color={colors.muted} />
        <TextInput
          autoFocus
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Cari paket umroh, hotel, atau informasi..."
          placeholderTextColor="#89919D"
          style={styles.input}
        />
      </View>
      {packages.isPending ? <PackagePreviewSkeleton /> : null}
      {results.map((item) => <PackagePreviewCard key={item.id} item={item} />)}
      {!packages.isPending && results.length === 0 ? <Text style={styles.empty}>Belum ada paket yang cocok dengan pencarian Anda.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  backButton: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  heading: { flex: 1, gap: 2 },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 24, lineHeight: 29 },
  subtitle: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 18 },
  search: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 15, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, color: colors.ink, fontFamily: "Montserrat_400Regular", fontSize: 15 },
  empty: { color: colors.muted, fontFamily: "Montserrat_400Regular", textAlign: "center", lineHeight: 22, paddingVertical: 24 },
});
