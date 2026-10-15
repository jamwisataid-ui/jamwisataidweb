import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, shadow, typography } from "@/theme";
import type { MuthowifSession } from "@/types";

export type BroadcastState = "idle" | "starting" | "live" | "muted" | "reconnecting" | "ended";
export type ConnectionLevel = "good" | "medium" | "poor";

function statusLabel(state: BroadcastState) {
  if (state === "starting") return "Menyiapkan siaran...";
  if (state === "reconnecting") return "Menyambungkan kembali...";
  if (state === "ended") return "Siaran telah berakhir";
  if (state === "live" || state === "muted") return "Siaran Sedang Berjalan";
  return "Siaran Belum Dimulai";
}

export function LiveStatusCard({ session, state, timer }: { session: MuthowifSession; state: BroadcastState; timer: string }) {
  const active = state === "live" || state === "muted" || state === "reconnecting";
  return <View style={styles.card}><View style={styles.statusRow}><View style={styles.statusLeft}><View style={[styles.dot, { backgroundColor: active ? "#22C55E" : colors.silver }]} /><Text style={[styles.status, active && styles.active]}>{statusLabel(state)}</Text></View><Text style={styles.timer}>{timer}</Text></View><Text style={styles.title}>{session.title}</Text><Text style={styles.meta}>{session.rombongan.name}</Text><Text style={styles.meta}>{new Date(session.startsAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</Text></View>;
}

export function MetricsRow({ listeners, capacity, quality }: { listeners: number; capacity: number; quality: ConnectionLevel }) {
  const qualityLabel = quality === "good" ? "Baik" : quality === "medium" ? "Sedang" : "Buruk";
  const color = quality === "good" ? "#22A060" : quality === "medium" ? "#D89C20" : colors.danger;
  return <View style={styles.metrics}><View style={styles.metric}><Ionicons name="people-outline" size={24} color={colors.goldDark} /><Text style={styles.metricValue}>{listeners} / {capacity}</Text><Text style={styles.metricLabel}>Jamaah Terhubung</Text></View><View style={styles.divider} /><View style={styles.metric}><Ionicons name="cellular" size={25} color={color} /><Text style={[styles.metricValue, { color }]}>{qualityLabel}</Text><Text style={styles.metricLabel}>Kualitas Koneksi</Text></View></View>;
}

const styles = StyleSheet.create({ card: { backgroundColor: colors.white, borderRadius: 18, padding: 18, gap: 4, borderWidth: 1, borderColor: colors.line, ...shadow }, statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }, statusLeft: { flexDirection: "row", alignItems: "center", gap: 7, flex: 1 }, dot: { width: 9, height: 9, borderRadius: 5 }, status: { color: colors.muted, fontFamily: typography.semibold, fontSize: 12 }, active: { color: "#20834E" }, timer: { color: colors.navy, fontFamily: typography.bold, fontSize: 14, fontVariant: ["tabular-nums"] }, title: { color: colors.navy, fontFamily: typography.bold, fontSize: 21, marginBottom: 3 }, meta: { color: colors.muted, fontFamily: typography.body, fontSize: 12, lineHeight: 18 }, metrics: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 16, flexDirection: "row", paddingVertical: 15 }, metric: { flex: 1, alignItems: "center", gap: 3 }, divider: { width: 1, backgroundColor: colors.line }, metricValue: { color: colors.navy, fontFamily: typography.bold, fontSize: 18 }, metricLabel: { color: colors.muted, fontFamily: typography.medium, fontSize: 11 } });
