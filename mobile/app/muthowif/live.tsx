import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BroadcastControls } from "@/components/muthowif/broadcast-controls";
import { BroadcastRoom } from "@/components/muthowif/broadcast-room";
import { EndLiveConfirmationModal } from "@/components/muthowif/end-live-modal";
import { LiveStatusCard, MetricsRow, type BroadcastState, type ConnectionLevel } from "@/components/muthowif/live-overview";
import { MuthowifBottomNav } from "@/components/muthowif/muthowif-bottom-nav";
import { MuthowifHeader } from "@/components/muthowif/muthowif-header";
import { RombonganInfoCard } from "@/components/muthowif/rombongan-info-card";
import { SessionSelector, sessionTypeTitle } from "@/components/muthowif/session-selector";
import { Button } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { requestBroadcastMicrophonePermission } from "@/lib/microphone-permission";
import { colors, typography } from "@/theme";
import type { MuthowifBroadcastCredentials, MuthowifSession } from "@/types";

const pad = (value: number) => String(value).padStart(2, "0");
const elapsed = (start?: string | null) => {
  if (!start) return "00:00:00";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(start).getTime()) / 1000));
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
};

export default function MuthowifPanelScreen() {
  const user = useAuthStore((value) => value.user);
  const tokens = useAuthStore((value) => value.tokens);
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["muthowif-sessions"], queryFn: () => api<MuthowifSession[]>("/muthowif/sessions"), enabled: Boolean(tokens && user?.role === "muthowif"), refetchInterval: 20_000 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<MuthowifBroadcastCredentials | null>(null);
  const [state, setState] = useState<BroadcastState>("idle");
  const [listeners, setListeners] = useState(0);
  const [quality, setQuality] = useState<ConnectionLevel>("good");
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [timer, setTimer] = useState("00:00:00");
  const [message, setMessage] = useState("");
  const [endOpen, setEndOpen] = useState(false);
  const [ending, setEnding] = useState(false);
  const sessions = useMemo(() => query.data ?? [], [query.data]);
  const session = useMemo(() => sessions.find((item) => item.id === selectedId) ?? sessions.find((item) => item.status === "live") ?? sessions.find((item) => item.status === "scheduled") ?? sessions[0], [selectedId, sessions]);

  useEffect(() => { if (!tokens || user?.role !== "muthowif") router.replace("/muthowif/login" as never); }, [tokens, user?.role]);
  useEffect(() => { const update = () => setTimer(elapsed(session?.liveStartedAt)); update(); const id = setInterval(update, 1000); return () => clearInterval(id); }, [session?.liveStartedAt]);

  const updateCachedSession = useCallback((changes: Partial<MuthowifSession>) => {
    if (!session) return;
    queryClient.setQueryData<MuthowifSession[]>(["muthowif-sessions"], (current) => current?.map((item) => item.id === session.id ? { ...item, ...changes } : item));
  }, [queryClient, session]);

  const handleRoomState = useCallback((next: BroadcastState) => {
    setState(next);
    if (next === "live" && session && session.status !== "live") {
      void api<{ liveStartedAt?: string | null }>(`/muthowif/sessions/${session.id}`, { method: "PATCH", body: JSON.stringify({ action: "start" }) })
        .then((result) => updateCachedSession({ status: "live", liveStartedAt: result.liveStartedAt }))
        .catch((error) => setMessage(error instanceof ApiError ? error.message : "Status siaran belum dapat diperbarui."));
    }
  }, [session, updateCachedSession]);
  const handleListeners = useCallback((count: number) => setListeners(count), []);
  const handleQuality = useCallback((value: ConnectionLevel) => setQuality(value), []);
  const handleRoomError = useCallback((value: string) => { setMessage(value); setListeners(0); setCredentials(null); }, []);

  useEffect(() => {
    if (!session || !credentials || (state !== "live" && state !== "muted")) return;
    const heartbeat = () => { void api(`/muthowif/sessions/${session.id}`, { method: "PATCH", body: JSON.stringify({ action: "heartbeat", listenerCount: listeners }) }).catch(() => undefined); };
    heartbeat();
    const id = setInterval(heartbeat, 15_000);
    return () => clearInterval(id);
  }, [credentials, listeners, session, state]);

  async function startBroadcast() {
    if (!session) return;
    setState("starting"); setMessage(""); setMicrophoneEnabled(true);
    try {
      if (!await requestBroadcastMicrophonePermission()) {
        setState("idle");
        setMessage("Izin mikrofon diperlukan. Aktifkan izin mikrofon Jam Wisata dari pengaturan perangkat, lalu coba kembali.");
        return;
      }
      const result = await api<MuthowifBroadcastCredentials>(`/muthowif/sessions/${session.id}/token`, { method: "POST" });
      setCredentials(result);
    } catch (error) { setState("idle"); setMessage(error instanceof ApiError ? error.message : "Siaran belum dapat dimulai."); }
  }
  async function endBroadcast() {
    if (!session) return;
    setEnding(true); setMessage("");
    try {
      await api(`/muthowif/sessions/${session.id}`, { method: "PATCH", body: JSON.stringify({ action: "end" }) });
      setCredentials(null); setState("ended"); setEndOpen(false); updateCachedSession({ status: "ended", liveEndedAt: new Date().toISOString() });
    } catch (error) { setMessage(error instanceof ApiError ? error.message : "Siaran belum dapat diakhiri."); }
    finally { setEnding(false); }
  }
  async function changeType(type: MuthowifSession["type"]) {
    if (!session || type === session.type) return;
    const title = sessionTypeTitle(type);
    try {
      await api(`/muthowif/sessions/${session.id}`, { method: "PATCH", body: JSON.stringify({ action: "metadata", type, title }) });
      updateCachedSession({ type, title });
    } catch (error) { setMessage(error instanceof ApiError ? error.message : "Jenis panduan belum dapat diubah."); }
  }

  if (!tokens || user?.role !== "muthowif") return null;
  if (query.isPending) return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><MuthowifHeader /><View style={styles.center}><Text style={styles.muted}>Menyiapkan panel muthowif...</Text></View></SafeAreaView>;
  if (!session) return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><MuthowifHeader /><View style={styles.center}><Ionicons name="calendar-outline" size={44} color={colors.goldDark} /><Text style={styles.emptyTitle}>Belum ada sesi panduan</Text><Text style={styles.muted}>Sesi yang ditugaskan kepada Anda akan muncul di sini.</Text><Button secondary label="Muat Ulang" onPress={() => void query.refetch()} /></View><MuthowifBottomNav active="live" /></SafeAreaView>;

  const effectiveState = state === "idle" && session.status === "ended" ? "ended" : state;
  const displayListeners = credentials ? listeners : session.listenerCount;
  const connected = effectiveState === "live" || effectiveState === "muted" || effectiveState === "reconnecting";
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><MuthowifHeader /><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    {state === "reconnecting" ? <View style={styles.reconnect}><Ionicons name="warning-outline" size={18} color="#8A5C00" /><Text style={styles.reconnectText}>Menyambungkan kembali... Audio akan dilanjutkan otomatis.</Text></View> : null}
    {message ? <Pressable style={styles.error} onPress={() => setMessage("")}><Ionicons name="alert-circle-outline" size={18} color={colors.danger} /><Text style={styles.errorText}>{message}</Text></Pressable> : null}
    {sessions.length > 1 ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sessionList}>{sessions.filter((item) => item.status !== "ended").map((item) => <Pressable key={item.id} disabled={connected} onPress={() => setSelectedId(item.id)} style={[styles.sessionChip, item.id === session.id && styles.sessionChipActive]}><Text style={[styles.sessionChipText, item.id === session.id && styles.sessionChipTextActive]} numberOfLines={1}>{item.rombongan.name}</Text></Pressable>)}</ScrollView> : null}
    <LiveStatusCard session={session} state={effectiveState === "idle" && session.status === "live" ? "live" : effectiveState} timer={timer} />
    <MetricsRow listeners={displayListeners} capacity={session.capacity} quality={quality} />
    <SessionSelector value={session.type} onChange={(value) => void changeType(value)} disabled={state === "starting" || state === "ended"} />
    <BroadcastControls state={effectiveState} microphoneEnabled={microphoneEnabled} resume={!credentials && session.status === "live"} onMicrophone={() => setMicrophoneEnabled((value) => !value)} onPrimary={() => connected ? setEndOpen(true) : void startBroadcast()} onVolume={() => Alert.alert("Volume Suara", "Atur volume monitoring melalui tombol volume perangkat. Level mikrofon siaran dikelola terpisah agar audio jamaah tetap stabil.")} />
    <RombonganInfoCard session={session} listeners={displayListeners} duration={timer} />
  </ScrollView><MuthowifBottomNav active="live" /><EndLiveConfirmationModal visible={endOpen} ending={ending} onCancel={() => setEndOpen(false)} onConfirm={() => void endBroadcast()} />
  {credentials ? <BroadcastRoom {...credentials} microphoneEnabled={microphoneEnabled} onState={handleRoomState} onListeners={handleListeners} onQuality={handleQuality} onError={handleRoomError} /> : null}</SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, content: { padding: 17, gap: 16, paddingBottom: 26 }, center: { flex: 1, padding: 28, alignItems: "center", justifyContent: "center", gap: 14 }, emptyTitle: { color: colors.navy, fontFamily: typography.bold, fontSize: 20 }, muted: { color: colors.muted, fontFamily: typography.body, textAlign: "center", lineHeight: 20 }, reconnect: { flexDirection: "row", gap: 8, padding: 11, borderRadius: 12, backgroundColor: "#FFF2CB" }, reconnectText: { flex: 1, color: "#704A00", fontFamily: typography.semibold, fontSize: 12 }, error: { flexDirection: "row", gap: 8, padding: 11, borderRadius: 12, backgroundColor: "#FFF0EE", borderWidth: 1, borderColor: "#F2C4BD" }, errorText: { flex: 1, color: colors.danger, fontFamily: typography.medium, fontSize: 12, lineHeight: 17 }, sessionList: { gap: 8 }, sessionChip: { maxWidth: 210, height: 36, justifyContent: "center", paddingHorizontal: 13, borderRadius: 18, backgroundColor: "#F0EEE8" }, sessionChipActive: { backgroundColor: colors.navy }, sessionChipText: { color: colors.navy, fontFamily: typography.semibold, fontSize: 11 }, sessionChipTextActive: { color: colors.white } });
