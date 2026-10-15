import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AyahItem } from "@/components/quran/ayah-item";
import { getSurah, revelationLabel } from "@/lib/quran";
import { loadQuranProgress, saveLastRead, toggleQuranBookmark, type QuranProgress } from "@/lib/quran-progress";
import { colors, typography } from "@/theme";

const empty: QuranProgress = { bookmarks: [], lastRead: null };

export default function SurahDetailScreen() {
  const params = useLocalSearchParams<{ surah: string; ayah?: string }>();
  const surah = getSurah(Number(params.surah));
  const initialAyah = Math.max(1, Number(params.ayah) || 1);
  const [progress, setProgress] = useState(empty);
  const list = useRef<FlatList>(null);
  useEffect(() => { void loadQuranProgress().then(setProgress); }, []);
  useEffect(() => { if (surah) void saveLastRead(surah.id, initialAyah).then(setProgress); }, [initialAyah, surah]);
  useEffect(() => { if (surah && initialAyah > 1) setTimeout(() => list.current?.scrollToIndex({ index: Math.min(initialAyah - 1, surah.verses.length - 1), animated: false, viewPosition: 0 }), 100); }, [initialAyah, surah]);
  const bookmarked = useMemo(() => new Set(progress.bookmarks.filter((item) => item.surahNumber === surah?.id).map((item) => item.ayahNumber)), [progress.bookmarks, surah?.id]);
  if (!surah) return <SafeAreaView style={styles.safe}><View style={styles.appBar}><Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.title}>Mushaf Qur&apos;an</Text><View style={styles.back} /></View><View style={styles.missing}><Text style={styles.missingTitle}>Surah tidak ditemukan</Text><Pressable onPress={() => router.replace("/quran")}><Text style={styles.link}>Kembali ke daftar surah</Text></Pressable></View></SafeAreaView>;
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><View style={styles.appBar}><Pressable accessibilityLabel="Kembali" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><View style={styles.heading}><Text numberOfLines={1} style={styles.title}>{surah.transliteration}</Text><Text style={styles.subtitle}>{surah.total_verses} ayat · {revelationLabel(surah.type)}</Text></View><View style={styles.back} /></View><FlatList ref={list} data={surah.verses} initialNumToRender={10} keyExtractor={(item) => String(item.id)} ListHeaderComponent={<View style={styles.hero}><Text style={styles.arabicName}>{surah.name}</Text><Text style={styles.meaning}>{surah.translation}</Text>{surah.id !== 1 && surah.id !== 9 ? <Text style={styles.basmalah}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text> : null}</View>} onScrollToIndexFailed={({ index }) => setTimeout(() => list.current?.scrollToIndex({ index, animated: false }), 300)} renderItem={({ item }) => <AyahItem bookmarked={bookmarked.has(item.id)} lastRead={progress.lastRead?.surahNumber === surah.id && progress.lastRead.ayahNumber === item.id} onBookmark={() => void toggleQuranBookmark(surah.id, item.id).then(setProgress)} onLastRead={() => void saveLastRead(surah.id, item.id).then(setProgress)} verse={item} />} showsVerticalScrollIndicator={false} windowSize={7} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, appBar: { minHeight: 62, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.line }, back: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" }, heading: { flex: 1, alignItems: "center" }, title: { color: colors.navy, fontFamily: typography.quranLatin, fontSize: 21, fontWeight: "700" }, subtitle: { marginTop: 1, color: colors.muted, fontFamily: typography.quranLatin, fontSize: 11 }, hero: { margin: 18, padding: 20, alignItems: "center", borderRadius: 20, backgroundColor: colors.navy }, arabicName: { color: colors.softGold, fontFamily: "ReemKufi_400Regular", fontSize: 34, lineHeight: 50 }, meaning: { color: "#DDE5EC", fontFamily: typography.quranLatin, fontSize: 13 }, basmalah: { marginTop: 16, color: colors.white, fontFamily: "ReemKufi_400Regular", fontSize: 23, lineHeight: 38, writingDirection: "rtl" }, missing: { flex: 1, alignItems: "center", justifyContent: "center" }, missingTitle: { color: colors.navy, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 18 }, link: { marginTop: 10, color: colors.gold, fontFamily: typography.quranLatin, fontWeight: "700", fontSize: 14 } });
