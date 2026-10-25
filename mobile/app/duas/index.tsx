import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DuaCategoryTabs, type DuaTab } from "@/components/dua/dua-category-tabs";
import { DuaEmptyState } from "@/components/dua/dua-empty-state";
import { DuaContentListItem, DuaListItem } from "@/components/dua/dua-list-item";
import { dhikrTabCollections, doaTabCollections, getDuaItemById, selectedItems, type DuaCollection, type DuaItem } from "@/lib/dua-dhikr";
import { loadDuaFavorites, type DuaFavorite } from "@/lib/dua-favorites";
import { colors, typography } from "@/theme";

function AppBar() { return <View style={styles.appBar}><Pressable accessibilityLabel="Kembali" onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.title}>Doa &amp; Dzikir</Text><View style={styles.back} /></View>; }
const openCollection = (collection: DuaCollection) => router.push({ pathname: "/duas/[collection]", params: { collection: collection.id } });
const openItem = (item: DuaItem) => router.push({ pathname: "/duas/[collection]/[item]", params: { collection: item.collectionId, item: item.id } });

export default function DuaDhikrScreen() {
  const [tab, setTab] = useState<DuaTab>("dua");
  const [favorites, setFavorites] = useState<DuaFavorite[]>([]);
  useFocusEffect(useCallback(() => { let active = true; void loadDuaFavorites().then((value) => { if (active) setFavorites(value); }); return () => { active = false; }; }, []));
  const favoriteItems = useMemo(() => favorites.map((favorite) => getDuaItemById(favorite.id)).filter((item): item is DuaItem => Boolean(item)), [favorites]);
  const header = <><AppBar /><DuaCategoryTabs onChange={setTab} value={tab} /></>;
  if (tab === "dua" || tab === "dhikr") { const data = tab === "dua" ? doaTabCollections : dhikrTabCollections; return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><FlatList contentContainerStyle={styles.bottom} data={data} keyExtractor={(item) => item.id} ListHeaderComponent={header} renderItem={({ item }) => <DuaListItem icon={item.icon} onPress={() => openCollection(item)} subtitle={item.subtitle} title={item.title} />} showsVerticalScrollIndicator={false} /></SafeAreaView>; }
  const data = tab === "selected" ? selectedItems : favoriteItems;
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><FlatList contentContainerStyle={data.length ? styles.bottom : undefined} data={data} keyExtractor={(item) => item.id} ListEmptyComponent={tab === "favorite" ? <DuaEmptyState /> : undefined} ListHeaderComponent={header} renderItem={({ item }) => <DuaContentListItem favorite={tab === "favorite"} item={item} onPress={() => openItem(item)} />} showsVerticalScrollIndicator={false} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, appBar: { minHeight: 58, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" }, title: { color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 22 }, bottom: { paddingBottom: 28 } });
