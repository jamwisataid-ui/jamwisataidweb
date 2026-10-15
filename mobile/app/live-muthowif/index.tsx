import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LiveHeader } from "@/components/live/live-header";
import { LiveInfoBanner } from "@/components/live/live-info-banner";
import { LiveSessionCard } from "@/components/live/live-session-card";
import { LiveEmptyState, LiveErrorState, LiveSkeleton } from "@/components/live/live-state";
import { LiveTabs, type LiveTab } from "@/components/live/live-tabs";
import { GuestGate } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { loadLiveMuthowifCache, saveLiveMuthowifCache, type LiveMuthowifCache } from "@/lib/live-muthowif-cache";
import { useLiveRoomStore } from "@/lib/live-room-store";
import { colors, typography } from "@/theme";
import type { LiveJoinCredentials, LiveMuthowifSession } from "@/types";

export default function LiveMuthowifListScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const setCredentials = useLiveRoomStore((state) => state.setCredentials);
  const [tab, setTab] = useState<LiveTab>("active");
  const [cache, setCache] = useState<LiveMuthowifCache | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const query = useQuery({
    queryKey: ["live-muthowif"],
    queryFn: async () => {
      const data = await api<LiveMuthowifSession[]>("/live-muthowif");
      await saveLiveMuthowifCache({ savedAt: new Date().toISOString(), data });
      return data;
    },
    enabled: Boolean(tokens),
    refetchInterval: 20_000,
  });
  useEffect(() => { if (tokens) void loadLiveMuthowifCache().then(setCache); }, [tokens]);
  const allSessions = useMemo(() => query.data ?? cache?.data ?? [], [cache?.data, query.data]);
  const sessions = useMemo(() => allSessions.filter((item) => tab === "active" ? item.status === "live" : item.status !== "live"), [allSessions, tab]);
  const showingCache = !query.data && Boolean(cache?.data.length);

  async function handleSession(item: LiveMuthowifSession) {
    if (item.status !== "live") return;
    setJoiningId(item.id); setMessage("");
    try {
      const result = await api<LiveJoinCredentials>(`/live-muthowif/${item.id}/token`, { method: "POST" });
      setCredentials(result);
      router.push(`/live-muthowif/${item.id}` as never);
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Siaran belum dapat dihubungkan. Silakan coba kembali.");
    } finally { setJoiningId(null); }
  }

  if (!tokens) return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><LiveHeader /><ScrollView contentContainerStyle={styles.guest}><LiveInfoBanner /><LiveTabs value="active" onChange={() => undefined} /><GuestGate title="Masuk untuk LIVE MUTHOWIF" body="Siaran hanya tersedia untuk jamaah yang sudah terdaftar dalam rombongan Jam Wisata." next="/live-muthowif" /></ScrollView></SafeAreaView>;

  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><LiveHeader /><FlatList
    data={sessions}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <LiveSessionCard item={item} joining={joiningId === item.id} onJoin={handleSession} />}
    refreshing={query.isRefetching}
    onRefresh={() => void query.refetch()}
    contentContainerStyle={styles.content}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    ListHeaderComponent={<View style={styles.headerContent}><LiveInfoBanner /><LiveTabs value={tab} onChange={(value) => { setTab(value); setMessage(""); }} />{showingCache ? <View style={styles.cache}><Ionicons name="cloud-offline-outline" size={15} color={colors.muted} /><Text style={styles.cacheText}>Jadwal tersimpan · diperbarui {new Date(cache!.savedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</Text></View> : null}{message ? <Pressable onPress={() => setMessage("")} style={styles.errorBanner}><Ionicons name="alert-circle-outline" size={18} color={colors.danger} /><Text style={styles.errorText}>{message}</Text></Pressable> : null}</View>}
    ListEmptyComponent={query.isPending && !cache ? <LiveSkeleton /> : query.isError && !cache ? <LiveErrorState onRetry={() => void query.refetch()} /> : <LiveEmptyState scheduled={tab === "schedule"} onSchedule={() => setTab("schedule")} />}
  /></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  guest: { padding: 18, gap: 18, paddingBottom: 38 },
  content: { padding: 18, paddingBottom: 38, flexGrow: 1 },
  headerContent: { gap: 17, marginBottom: 16 },
  separator: { height: 14 },
  cache: { flexDirection: "row", alignItems: "center", gap: 7 },
  cacheText: { flex: 1, color: colors.muted, fontFamily: typography.body, fontSize: 11 },
  errorBanner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 11, borderRadius: 11, backgroundColor: "#FFF0EE", borderWidth: 1, borderColor: "#F2C4BD" },
  errorText: { flex: 1, color: colors.danger, fontFamily: typography.medium, fontSize: 12, lineHeight: 17 },
});
