import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { Button, Card, GuestGate, Screen, Title } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { documentStatus, latestDocumentsByKind, pilgrimDocumentKinds, type PilgrimDocumentKind } from "@/lib/documents";
import { colors } from "@/theme";
import type { Document } from "@/types";

export default function DocumentsScreen() {
  const tokens = useAuthStore((state) => state.tokens);
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["documents"], queryFn: () => api<Document[]>("/documents"), enabled: Boolean(tokens) });
  const [busyKind, setBusyKind] = useState<PilgrimDocumentKind | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; error: boolean } | null>(null);
  const latest = latestDocumentsByKind(query.data);

  const upload = async (kind: PilgrimDocumentKind, label: string) => {
    const result = await DocumentPicker.getDocumentAsync({ type: ["image/jpeg", "image/png", "image/webp", "application/pdf"], copyToCacheDirectory: true });
    if (result.canceled) return;
    setBusyKind(kind); setFeedback(null);
    const asset = result.assets[0];
    const form = new FormData();
    form.append("kind", kind);
    form.append("file", { uri: asset.uri, name: asset.name, type: asset.mimeType || "application/octet-stream" } as unknown as Blob);
    try {
      await api("/documents", { method: "POST", body: form });
      await client.invalidateQueries({ queryKey: ["documents"] });
      setFeedback({ message: `${label} berhasil diunggah dan menunggu pemeriksaan.`, error: false });
    } catch (error) {
      setFeedback({ message: error instanceof ApiError ? error.message : "Dokumen gagal diunggah. Silakan coba lagi.", error: true });
    } finally { setBusyKind(null); }
  };

  const open = async (id: string, mode: "preview" | "download") => {
    setOpeningId(`${id}-${mode}`); setFeedback(null);
    try {
      const result = await api<{ url: string }>(`/documents/${id}?mode=${mode}&format=json`);
      const supported = await Linking.canOpenURL(result.url);
      if (!supported) throw new Error("unsupported URL");
      await Linking.openURL(result.url);
    } catch {
      setFeedback({ message: mode === "preview" ? "Preview dokumen belum dapat dibuka. Silakan coba lagi." : "Dokumen gagal diunduh. Silakan coba lagi.", error: true });
    } finally { setOpeningId(null); }
  };

  if (!tokens) return <Screen><Title subtitle="Dokumen tersimpan aman dan terhubung ke data jamaah.">Dokumen jamaah</Title><GuestGate body="Masuk sebelum mengunggah atau melihat KTP, paspor, Buku Vaksin, dan dokumen pribadi lainnya." next="/documents" /></Screen>;

  return <Screen><Title subtitle="Format JPG, PNG, WebP, atau PDF. Maksimal 10 MB.">Dokumen jamaah</Title>
    {feedback ? <View style={[styles.feedback, feedback.error && styles.feedbackError]}><Ionicons name={feedback.error ? "alert-circle-outline" : "checkmark-circle-outline"} size={20} color={feedback.error ? colors.danger : colors.success} /><Text style={[styles.feedbackText, feedback.error && styles.feedbackTextError]}>{feedback.message}</Text></View> : null}
    {query.isPending ? <Card><Text style={styles.stateText}>Memuat dokumen jamaah…</Text></Card> : null}
    {query.isError ? <Card><Ionicons name="cloud-offline-outline" size={30} color={colors.gold} /><Text style={styles.stateTitle}>Dokumen belum dapat dimuat</Text><Text style={styles.stateText}>Periksa koneksi Anda, lalu coba kembali.</Text><Button secondary label="Coba Lagi" onPress={() => void query.refetch()} /></Card> : null}
    {!query.isPending && !query.isError ? <View style={styles.list}>{pilgrimDocumentKinds.map((kind) => {
      const document = latest.get(kind.value);
      const status = documentStatus(document);
      const busy = busyKind === kind.value;
      return <Card key={kind.value}><View style={styles.heading}><View style={[styles.icon, document && styles.iconReady]}><Ionicons name={document ? "document-text" : "cloud-upload-outline"} size={22} color={document ? colors.white : colors.navy} /></View><View style={styles.copy}><Text style={styles.name}>{kind.label}</Text><Text numberOfLines={1} style={styles.fileName}>{document?.originalName ?? `${status.label} · ${kind.note}`}</Text><Text style={[styles.status, status.tone === "verified" && styles.verified, status.tone === "rejected" && styles.rejected]}>{document ? status.label : "Belum terunggah"}</Text></View></View>{document ? <View style={styles.actions}><Pressable disabled={openingId !== null} onPress={() => void open(document.id, "preview")} style={styles.action}><Ionicons name="eye-outline" size={17} color={colors.navy} /><Text style={styles.actionText}>{openingId === `${document.id}-preview` ? "Membuka…" : "Preview"}</Text></Pressable><Pressable disabled={openingId !== null} onPress={() => void open(document.id, "download")} style={styles.action}><Ionicons name="download-outline" size={17} color={colors.navy} /><Text style={styles.actionText}>{openingId === `${document.id}-download` ? "Mengunduh…" : "Download"}</Text></Pressable></View> : null}<Pressable disabled={busyKind !== null} onPress={() => void upload(kind.value, kind.label)} style={[styles.upload, busyKind !== null && styles.disabled]}><Text style={styles.uploadText}>{busy ? "Mengunggah…" : document ? `Ganti ${kind.label}` : `Unggah ${kind.label}`}</Text></Pressable></Card>;
    })}</View> : null}
  </Screen>;
}

const styles = StyleSheet.create({
  list: { gap: 12 }, heading: { flexDirection: "row", alignItems: "center", gap: 12 }, icon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.goldPale }, iconReady: { backgroundColor: colors.navy }, copy: { flex: 1, minWidth: 0, gap: 3 }, name: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 15 }, fileName: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5 }, status: { color: colors.goldDark, fontFamily: "Montserrat_700Bold", fontSize: 10.5 }, verified: { color: colors.success }, rejected: { color: colors.danger }, actions: { flexDirection: "row", gap: 9 }, action: { minHeight: 40, flex: 1, borderRadius: 11, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }, actionText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 11.5 }, upload: { minHeight: 44, borderRadius: 12, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center", paddingHorizontal: 14 }, uploadText: { color: colors.white, fontFamily: "Montserrat_700Bold", fontSize: 13 }, disabled: { opacity: .55 }, feedback: { padding: 13, borderRadius: 13, backgroundColor: "#EAF5EE", flexDirection: "row", alignItems: "flex-start", gap: 9 }, feedbackError: { backgroundColor: "#FDECEC" }, feedbackText: { flex: 1, color: colors.success, fontFamily: "Montserrat_500Medium", fontSize: 12.5, lineHeight: 18 }, feedbackTextError: { color: colors.danger }, stateTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 17 }, stateText: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 20 },
});
