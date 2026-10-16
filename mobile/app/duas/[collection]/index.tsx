import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DuaContentListItem } from "@/components/dua/dua-list-item";
import { getDuaCollection } from "@/lib/dua-dhikr";
import { colors, typography } from "@/theme";

export default function DuaCollectionScreen() {
  const { collection: id } = useLocalSearchParams<{ collection: string }>();
  const collection = getDuaCollection(id);
  if (!collection) return <SafeAreaView style={styles.safe}><Text style={styles.missing}>Kumpulan bacaan tidak ditemukan.</Text></SafeAreaView>;
  const header = <><View style={styles.appBar}><Pressable accessibilityLabel="Kembali" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text numberOfLines={1} style={styles.title}>{collection.title}</Text><View style={styles.back} /></View><View style={styles.intro}><Text style={styles.introTitle}>{collection.title}</Text><Text style={styles.introBody}>{collection.subtitle} · {collection.items.length} bacaan</Text></View></>;
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><FlatList contentContainerStyle={styles.bottom} data={collection.items} initialNumToRender={12} keyExtractor={(item) => item.id} ListHeaderComponent={header} renderItem={({ item }) => <DuaContentListItem item={item} onPress={() => router.push({ pathname: "/duas/[collection]/[item]", params: { collection: collection.id, item: item.id } })} />} showsVerticalScrollIndicator={false} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, appBar: { minHeight: 58, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, title: { flex: 1, color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 20, textAlign: "center" }, intro: { margin: 18, marginBottom: 5, padding: 18, borderRadius: 18, backgroundColor: colors.navy }, introTitle: { color: colors.white, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 18 }, introBody: { marginTop: 5, color: "#CAD6E2", fontFamily: typography.quranLatin, fontSize: 12.5, lineHeight: 18 }, bottom: { paddingBottom: 28 }, missing: { margin: 30, color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 16 } });
