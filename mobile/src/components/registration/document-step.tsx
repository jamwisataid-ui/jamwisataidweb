import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Document } from "@/types";
import { colors } from "@/theme";

const requirements = [
  { kind: "ktp", label: "KTP", note: "Wajib" },
  { kind: "kk", label: "Kartu Keluarga", note: "Wajib" },
  { kind: "akta_lahir", label: "Akta Lahir", note: "Minimal salah satu dokumen pendukung" },
  { kind: "buku_nikah", label: "Buku Nikah", note: "Minimal salah satu dokumen pendukung" },
  { kind: "ijazah", label: "Ijazah", note: "Minimal salah satu dokumen pendukung" },
  { kind: "paspor", label: "Paspor", note: "Lengkapi saat sudah tersedia" },
  { kind: "buku_vaksin", label: "Buku Vaksin", note: "Dokumen tambahan" },
] as const;

export function DocumentStep() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["documents"], queryFn: () => api<Document[]>("/documents") });
  const [busyKind, setBusyKind] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const latest = new Map<string, Document>();
  query.data?.forEach((document) => { if (!latest.has(document.kind)) latest.set(document.kind, document); });

  const upload = async (kind: string, label: string) => {
    const result = await DocumentPicker.getDocumentAsync({ type: ["image/jpeg", "image/png", "image/webp", "application/pdf"], copyToCacheDirectory: true });
    if (result.canceled) return;
    setBusyKind(kind); setMessage("");
    const asset = result.assets[0];
    const form = new FormData();
    form.append("kind", kind);
    form.append("file", { uri: asset.uri, name: asset.name, type: asset.mimeType || "application/octet-stream" } as unknown as Blob);
    try {
      await api("/documents", { method: "POST", body: form });
      await client.invalidateQueries({ queryKey: ["documents"] });
      setMessage(`${label} berhasil diunggah.`);
    } catch (error) { setMessage(error instanceof ApiError ? error.message : "Dokumen gagal diunggah. Silakan coba lagi."); }
    setBusyKind(null);
  };
  const open = async (id: string) => { const result = await api<{ url: string }>(`/documents/${id}?mode=preview&format=json`); await Linking.openURL(result.url); };

  return <View style={styles.root}><View><Text style={styles.title}>Dokumen Jamaah</Text><Text style={styles.copy}>Unggah sekarang atau lengkapi nanti. KTP, KK, dan salah satu Akta Lahir/Buku Nikah/Ijazah mengikuti rule dokumen Jam Wisata.</Text></View>{requirements.map((item) => {
    const document = latest.get(item.kind);
    return <View key={item.kind} style={styles.row}><View style={[styles.icon, document && styles.iconDone]}><Ionicons name={document ? "checkmark" : "document-outline"} size={20} color={document ? colors.white : colors.navy} /></View><View style={styles.details}><Text style={styles.name}>{item.label}</Text><Text style={styles.note}>{document ? document.originalName : `Belum diunggah · ${item.note}`}</Text>{document ? <Pressable onPress={() => open(document.id)}><Text style={styles.preview}>Preview</Text></Pressable> : null}</View><Pressable disabled={busyKind !== null} onPress={() => upload(item.kind, item.label)} style={styles.upload}><Text style={styles.uploadText}>{busyKind === item.kind ? "Mengunggah…" : document ? "Ganti" : "Unggah"}</Text></Pressable></View>;
  })}{message ? <Text style={styles.message}>{message}</Text> : null}<Text style={styles.format}>Format JPG, PNG, WebP, atau PDF · maksimal 10 MB.</Text></View>;
}

const styles = StyleSheet.create({ root: { gap: 13 }, title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 23 }, copy: { marginTop: 6, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13.5, lineHeight: 20 }, row: { flexDirection: "row", alignItems: "center", gap: 11, minHeight: 78, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.line }, icon: { width: 40, height: 40, borderRadius: 13, backgroundColor: "#F4E9D5", alignItems: "center", justifyContent: "center" }, iconDone: { backgroundColor: colors.success }, details: { flex: 1, minWidth: 0 }, name: { color: colors.ink, fontFamily: "Montserrat_700Bold", fontSize: 14 }, note: { marginTop: 3, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5, lineHeight: 16 }, preview: { marginTop: 5, color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 12 }, upload: { minWidth: 66, minHeight: 38, borderRadius: 11, borderWidth: 1, borderColor: colors.gold, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }, uploadText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 12 }, message: { color: colors.success, fontFamily: "Montserrat_500Medium", fontSize: 13 }, format: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5 } });
