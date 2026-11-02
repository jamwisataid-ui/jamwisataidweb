import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import kaaba from "../assets/splash/kaaba-masjidil-haram.jpg";
import { CircleButton, GoldOrnament } from "@/components/ui";
import { LocationSelector } from "@/components/prayer/location-selector";
import { PrayerDateHeader } from "@/components/prayer/prayer-date-header";
import { PrayerTimeList } from "@/components/prayer/prayer-time-list";
import { PrayerTimesState } from "@/components/prayer/prayer-times-state";
import { PrayerUtilityGrid } from "@/components/prayer/prayer-utility-grid";
import { api } from "@/lib/api";
import { loadPrayerCache, loadPrayerLocation, savePrayerCache, savePrayerLocation, type PrayerCache } from "@/lib/prayer-cache";
import { dateInTimezone, hijriMonths, minutesInTimezone, nextPrayer, prayerLocations, prayerRows, qiblaBearing, type PrayerLocation } from "@/lib/prayer-times";
import { colors } from "@/theme";
import type { PrayerTimes } from "@/types";

function PrayerHero({ data, now }: { data?: PrayerTimes; now: Date }) {
  const insets = useSafeAreaInsets();
  const goBack = () => router.canGoBack() ? router.back() : router.replace("/(tabs)");
  let next: { name: string; time: string; remaining: string } | null = null;
  if (data) {
    const result = nextPrayer(data.times, data.location.timezone, now);
    const [hour, minute] = data.times[result.key].split(":").map(Number);
    let diff = hour * 60 + minute - minutesInTimezone(data.location.timezone, now);
    if (result.tomorrow || diff < 0) diff += 24 * 60;
    next = { name: prayerRows.find((row) => row.key === result.key)?.name ?? "", time: data.times[result.key], remaining: `${String(Math.floor(diff / 60)).padStart(2, "0")} j ${String(diff % 60).padStart(2, "0")} m` };
  }
  return <View style={[styles.hero, { paddingTop: insets.top + 10 }]}><Image alt="" source={kaaba} resizeMode="cover" style={styles.heroImage} /><LinearGradient colors={["rgba(6,21,43,0.6)", "rgba(6,21,43,0.3)", "rgba(6,21,43,0.9)"]} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} /><View style={styles.heroBar}><CircleButton dark icon="chevron-back" label="Kembali" onPress={goBack} /><Text style={styles.heroTitle}>JADWAL SHOLAT</Text><View style={styles.heroSpacer} /></View>{next ? <View style={styles.heroCenter}><Text style={styles.heroEyebrow}>SHOLAT BERIKUTNYA</Text><Text style={styles.heroName}>{next.name.toLocaleUpperCase("id-ID")}</Text><Text style={styles.heroTime}>{next.time}</Text><View style={styles.heroCountdown}><GoldOrnament width={22} /><Text style={styles.heroRemaining}>dalam {next.remaining}</Text><GoldOrnament width={22} /></View></View> : <View style={styles.heroCenter}><Text style={styles.heroEyebrow}>WAKTU SHOLAT</Text></View>}</View>;
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
    void loadPrayerLocation().then((id) => {
      const saved = prayerLocations.find((item) => item.id === id);
      if (active && saved) setLocation(saved);
    });
    return () => { active = false; };
  }, []);
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

  const changeLocation = (next: PrayerLocation) => { setCache(null); setLocation(next); void savePrayerLocation(next.id); };
  return <View style={styles.safe}><PrayerHero data={data} now={now} /><View style={styles.sheet}><LocationSelector value={location} open={pickerOpen} onOpen={() => setPickerOpen(true)} onClose={() => setPickerOpen(false)} onChange={changeLocation} />{showingCache ? <View style={styles.cacheBanner}><Ionicons name="cloud-offline-outline" size={15} color={colors.muted} /><Text style={styles.cacheText}>Jadwal tersimpan · diperbarui {new Date(cache!.savedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</Text></View> : null}{data ? <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><PrayerDateHeader data={data} /><PrayerTimeList data={data} now={now} /><Text style={styles.method}>{data.calculation}</Text><PrayerUtilityGrid items={utilities} /></ScrollView> : <PrayerTimesState loading={query.isPending} onRetry={() => void query.refetch()} />}</View></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  hero: { minHeight: 330, paddingHorizontal: 20, paddingBottom: 54, overflow: "hidden", backgroundColor: colors.navyDeep }, heroImage: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.5 },
  heroBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, heroTitle: { color: colors.white, fontFamily: "Cinzel_600SemiBold", fontSize: 13, letterSpacing: 3 }, heroSpacer: { width: 44 },
  heroCenter: { marginTop: 18, alignItems: "center", gap: 4 }, heroEyebrow: { color: colors.gold, fontFamily: "Cinzel_600SemiBold", fontSize: 10.5, letterSpacing: 4 }, heroName: { color: colors.white, fontFamily: "Cinzel_600SemiBold", fontSize: 22, letterSpacing: 4 },
  heroTime: { color: colors.softGold, fontFamily: "CormorantGaramond_500Medium", fontSize: 84, lineHeight: 90 }, heroCountdown: { flexDirection: "row", alignItems: "center", gap: 10 }, heroRemaining: { color: "rgba(255,255,255,0.86)", fontFamily: "Montserrat_500Medium", fontSize: 12.5 },
  sheet: { flex: 1, marginTop: -30, paddingTop: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: colors.ivory },
  content: { paddingBottom: 38 }, method: { marginTop: 10, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 10.5, textAlign: "center" },
  cacheBanner: { marginHorizontal: 20, marginTop: 10, flexDirection: "row", alignItems: "center", gap: 7 }, cacheText: { flex: 1, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5 },
});
