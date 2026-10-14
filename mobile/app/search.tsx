import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { PackagePreviewCard, PackagePreviewSkeleton } from "@/components/home/package-preview-card";
import { Screen, Title } from "@/components/ui";
import { api } from "@/lib/api";
import { colors } from "@/theme";
import type { Package } from "@/types";

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const packages = useQuery({ queryKey: ["packages"], queryFn: () => api<Package[]>("/packages") });
  const results = useMemo(() => {
    const value = keyword.trim().toLocaleLowerCase("id-ID");
    if (!value) return packages.data ?? [];
    return (packages.data ?? []).filter((item) => [item.name, item.airline, item.makkahHotel?.name, item.madinahHotel?.name]
      .filter(Boolean)
      .some((field) => String(field).toLocaleLowerCase("id-ID").includes(value)));
  }, [keyword, packages.data]);

  return (
    <Screen>
      <Title subtitle="Temukan paket, maskapai, atau hotel pilihan Anda.">Cari perjalanan</Title>
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
  search: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 15, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  input: { flex: 1, color: colors.ink, fontFamily: "DMSans_400Regular", fontSize: 15 },
  empty: { color: colors.muted, fontFamily: "DMSans_400Regular", textAlign: "center", lineHeight: 22, paddingVertical: 24 },
});
