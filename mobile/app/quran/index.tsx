import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LastReadCard } from "@/components/quran/last-read-card";
import { QuranEmptyState } from "@/components/quran/quran-empty-state";
import { QuranSearchBar } from "@/components/quran/quran-search-bar";
import { QuranTabs, type QuranTab } from "@/components/quran/quran-tabs";
import { SurahListItem } from "@/components/quran/surah-list-item";
import { SurahNumberBadge } from "@/components/quran/surah-number-badge";
import { filterSurahs, getSurah, juz, type QuranSurah } from "@/lib/quran";
import { loadQuranProgress, type QuranProgress } from "@/lib/quran-progress";
import { colors } from "@/theme";

const initialProgress: QuranProgress = { bookmarks: [], lastRead: null };

function AppBar() { return <View style={styles.appBar}><Pressable accessibilityLabel="Kembali" onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.title}>Mushaf Qur&apos;an</Text><View style={styles.back} /></View>; }

export default function QuranScreen() {
  const [tab, setTab] = useState<QuranTab>("surah");
  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState(initialProgress);
  useFocusEffect(useCallback(() => { let active = true; void loadQuranProgress().then((value) => { if (active) setProgress(value); }); return () => { active = false; }; }, []));
  const filtered = useMemo(() => filterSurahs(query), [query]);
  const bookmarks = useMemo(() => progress.bookmarks.map((bookmark) => ({ bookmark, surah: getSurah(bookmark.surahNumber) })).filter((item): item is { bookmark: typeof item.bookmark; surah: QuranSurah } => Boolean(item.surah)), [progress.bookmarks]);
  const lastSurah = progress.lastRead ? getSurah(progress.lastRead.surahNumber) : undefined;
  const openSurah = (surah: number, ayah?: number) => router.push({ pathname: "/quran/[surah]", params: { surah: String(surah), ...(ayah ? { ayah: String(ayah) } : {}) } });
  const header = <><AppBar /><QuranTabs value={tab} onChange={(value) => { setTab(value); setQuery(""); }} />{tab === "surah" ? <QuranSearchBar value={query} onChangeText={setQuery} /> : null}{lastSurah && progress.lastRead && tab === "surah" ? <LastReadCard ayah={progress.lastRead.ayahNumber} onPress={() => openSurah(lastSurah.id, progress.lastRead!.ayahNumber)} surah={lastSurah.transliteration} /> : null}</>;

  if (tab === "surah") return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><FlatList data={filtered} initialNumToRender={14} keyboardShouldPersistTaps="handled" keyExtractor={(item) => String(item.id)} ListEmptyComponent={<QuranEmptyState />} ListHeaderComponent={header} renderItem={({ item }) => <SurahListItem onPress={() => openSurah(item.id)} surah={item} />} showsVerticalScrollIndicator={false} windowSize={8} /></SafeAreaView>;
  if (tab === "juz") return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>{header}<FlatList contentContainerStyle={styles.listBottom} data={juz} keyExtractor={(_, index) => String(index + 1)} renderItem={({ item, index }) => <Pressable onPress={() => openSurah(item[0], item[1])} style={({ pressed }) => [styles.juzRow, pressed && { opacity: .62 }]}><SurahNumberBadge label={String(index + 1)} /><View style={styles.juzCopy}><Text style={styles.juzTitle}>Juz {index + 1}</Text><Text style={styles.juzMeta}>{item[2]}</Text></View><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>} showsVerticalScrollIndicator={false} /></SafeAreaView>;
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>{header}<FlatList contentContainerStyle={bookmarks.length ? styles.listBottom : undefined} data={bookmarks} keyExtractor={(item) => `${item.bookmark.surahNumber}:${item.bookmark.ayahNumber}`} ListEmptyComponent={<QuranEmptyState bookmark />} renderItem={({ item }) => <Pressable onPress={() => openSurah(item.surah.id, item.bookmark.ayahNumber)} style={({ pressed }) => [styles.bookmarkRow, pressed && { opacity: .62 }]}><SurahNumberBadge number={item.bookmark.ayahNumber} /><View style={styles.juzCopy}><Text style={styles.juzTitle}>{item.surah.transliteration} · Ayat {item.bookmark.ayahNumber}</Text><Text numberOfLines={2} style={styles.juzMeta}>{item.surah.verses[item.bookmark.ayahNumber - 1]?.translation}</Text></View><Ionicons name="bookmark" size={19} color={colors.gold} /></Pressable>} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, appBar: { minHeight: 58, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" }, title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 22 }, listBottom: { paddingBottom: 28 }, juzRow: { minHeight: 72, marginHorizontal: 18, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, bookmarkRow: { minHeight: 82, marginHorizontal: 18, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 12, borderBottomWidth: 1, borderBottomColor: colors.line }, juzCopy: { flex: 1 }, juzTitle: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 16 }, juzMeta: { marginTop: 3, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 12.2, lineHeight: 18 } });
