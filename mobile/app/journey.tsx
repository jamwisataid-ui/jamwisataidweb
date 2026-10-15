import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ImportantInfoList } from "@/components/itinerary/important-info-list";
import { ItineraryState } from "@/components/itinerary/itinerary-state";
import { ItineraryTabs, type ItineraryTab } from "@/components/itinerary/itinerary-tabs";
import { TimelineList } from "@/components/itinerary/timeline-list";
import { GuestGate } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { loadJourneyCache, saveJourneyCache, type JourneyCache } from "@/lib/journey-cache";
import { colors } from "@/theme";
import type { Journey } from "@/types";

function AppBar() {
  const goBack = () => router.canGoBack() ? router.back() : router.replace("/(tabs)");
  return <View style={styles.appBar}><Pressable accessibilityLabel="Kembali" accessibilityRole="button" onPress={goBack} style={styles.back}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.title}>Itinerary Perjalanan</Text><View style={styles.back} /></View>;
}

function JourneyPicker({ items, selected, onChange }: { items: Journey[]; selected: string; onChange: (id: string) => void }) {
  if (items.length < 2) return null;
  return <ScrollView horizontal contentContainerStyle={styles.pickerContent} showsHorizontalScrollIndicator={false}>{items.map((item) => <Pressable key={item.registrationId} onPress={() => onChange(item.registrationId)} style={[styles.picker, selected === item.registrationId && styles.pickerActive]}><Text numberOfLines={1} style={[styles.pickerText, selected === item.registrationId && styles.pickerTextActive]}>{item.package.name}</Text><Text style={[styles.pickerDate, selected === item.registrationId && styles.pickerTextActive]}>{item.departure.dateLabel}</Text></Pressable>)}</ScrollView>;
}

export default function JourneyScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const [tab, setTab] = useState<ItineraryTab>("schedule");
  const [selectedId, setSelectedId] = useState("");
  const [cache, setCache] = useState<JourneyCache | null>(null);
  const query = useQuery({
    queryKey: ["journey"],
    queryFn: async () => {
      const data = await api<Journey[]>("/journey");
      await saveJourneyCache({ savedAt: new Date().toISOString(), data });
      return data;
    },
    enabled: Boolean(tokens),
  });

  useEffect(() => { if (tokens) void loadJourneyCache().then(setCache); }, [tokens]);
  const journeys = useMemo(() => query.data ?? cache?.data ?? [], [cache?.data, query.data]);
  const selected = useMemo(() => journeys.find((item) => item.registrationId === selectedId) ?? journeys[0], [journeys, selectedId]);
  const showingCache = !query.data && Boolean(cache?.data.length);

  if (!tokens) return <SafeAreaView style={styles.safe}><AppBar /><ScrollView contentContainerStyle={styles.guest}><GuestGate title="Masuk untuk melihat itinerary" body="Itinerary hanya tersedia untuk jamaah yang sudah mendaftar paket." next="/journey" /></ScrollView></SafeAreaView>;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <AppBar />
      <ItineraryTabs value={tab} onChange={setTab} />
      <JourneyPicker items={journeys} selected={selected?.registrationId ?? ""} onChange={setSelectedId} />
      {showingCache ? <View style={styles.cacheBanner}><Ionicons name="cloud-offline-outline" size={15} color={colors.muted} /><Text style={styles.cacheText}>Data tersimpan · terakhir diperbarui {new Date(cache!.savedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</Text></View> : null}
      {!selected ? <ItineraryState loading={query.isPending} error={query.isError} onRetry={() => void query.refetch()} /> : tab === "schedule" ? <TimelineList journey={selected} /> : <ImportantInfoList journey={selected} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  appBar: { minHeight: 58, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  back: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 21 },
  guest: { padding: 20, paddingTop: 28 },
  pickerContent: { paddingHorizontal: 18, paddingTop: 12, gap: 9 },
  picker: { maxWidth: 220, minHeight: 54, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  pickerActive: { borderColor: colors.gold, backgroundColor: "#F8F1DC" },
  pickerText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 12 },
  pickerDate: { marginTop: 2, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 10.5 },
  pickerTextActive: { color: colors.navy },
  cacheBanner: { marginHorizontal: 18, marginTop: 12, flexDirection: "row", alignItems: "center", gap: 7 },
  cacheText: { flex: 1, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5 },
});
