import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocationSelector } from "@/components/prayer/location-selector";
import { PrayerDateHeader } from "@/components/prayer/prayer-date-header";
import { PrayerTimeList } from "@/components/prayer/prayer-time-list";
import { PrayerTimesState } from "@/components/prayer/prayer-times-state";
import { PrayerUtilityGrid } from "@/components/prayer/prayer-utility-grid";
import { api } from "@/lib/api";
import { loadPrayerCache, savePrayerCache, type PrayerCache } from "@/lib/prayer-cache";
import { dateInTimezone, hijriMonths, prayerLocations, qiblaBearing, type PrayerLocation } from "@/lib/prayer-times";
import { colors } from "@/theme";
import type { PrayerTimes } from "@/types";

function AppBar() {
  const goBack = () => router.canGoBack() ? router.back() : router.replace("/(tabs)");
  return <View style={styles.appBar}><Pressable accessibilityLabel="Kembali" accessibilityRole="button" onPress={goBack} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.title}>Jadwal Sholat</Text><View style={styles.back} /></View>;
}

export default function PrayerTimesScreen() {
  const [location, setLocation] = useState<PrayerLocation>(prayerLocations[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [cache, setCache] = useState<PrayerCache | null>(null);
  const date = dateInTimezone(location.timezone, now);
  const query = useQuery({
    queryKey: ["prayer-times", location.id, date],
    queryFn: async () => {
      const data = await api<PrayerTimes>(`/prayer-times?location=${location.id}&date=${date}`);
      await savePrayerCache(location.id, date, data);
      return data;
    },
    staleTime: 5 * 60_000,
  });

  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 30_000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    let active = true;
    void loadPrayerCache(location.id, date).then((value) => { if (active) setCache(value); });
    return () => { active = false; };
  }, [date, location.id]);
  const data = query.data ?? cache?.data;
  const showingCache = !query.data && Boolean(cache?.data);
  const hijriLabel = data ? `${data.date.hijri.day} ${hijriMonths[data.date.hijri.month - 1] ?? data.date.hijri.monthName} ${data.date.hijri.year} H` : "";
  const utilities = useMemo(() => data ? [
    { label: "Arah Kiblat", icon: "compass-outline" as const, onPress: () => Alert.alert("Arah Kiblat", `Dari ${data.location.city}, arah kiblat sekitar ${qiblaBearing(data.location.latitude, data.location.longitude)}° dari utara.`) },
    { label: "Kalender Hijriyah", icon: "calendar-outline" as const, onPress: () => Alert.alert("Tanggal Hijriyah", hijriLabel) },
    { label: "Doa Setelah Sholat", icon: "book-outline" as const, onPress: () => router.push("/duas") },
  ] : [], [data, hijriLabel]);

  const changeLocation = (next: PrayerLocation) => { setCache(null); setLocation(next); };
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><AppBar /><LocationSelector value={location} open={pickerOpen} onOpen={() => setPickerOpen(true)} onClose={() => setPickerOpen(false)} onChange={changeLocation} />{showingCache ? <View style={styles.cacheBanner}><Ionicons name="cloud-offline-outline" size={15} color={colors.muted} /><Text style={styles.cacheText}>Jadwal tersimpan · diperbarui {new Date(cache!.savedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</Text></View> : null}{data ? <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><PrayerDateHeader data={data} /><PrayerTimeList data={data} now={now} /><Text style={styles.method}>{data.calculation}</Text><PrayerUtilityGrid items={utilities} /></ScrollView> : <PrayerTimesState loading={query.isPending} onRetry={() => void query.refetch()} />}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  appBar: { minHeight: 58, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" }, title: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 22 },
  content: { paddingBottom: 38 }, method: { marginTop: 10, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 10.5, textAlign: "center" },
  cacheBanner: { marginHorizontal: 20, marginTop: 10, flexDirection: "row", alignItems: "center", gap: 7 }, cacheText: { flex: 1, color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 11.5 },
});
