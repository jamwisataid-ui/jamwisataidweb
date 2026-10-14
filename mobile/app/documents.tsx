import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { api, ApiError } from "@/lib/api";
import type { Document } from "@/types";
import { Button, Card, Empty, Screen, Section, Title } from "@/components/ui";
import { colors } from "@/theme";

const kinds = [{ value: "ktp", label: "KTP" }, { value: "kk", label: "Kartu Keluarga" }, { value: "paspor", label: "Paspor" }, { value: "buku_vaksin", label: "Buku Vaksin" }, { value: "akta_lahir", label: "Akta Lahir" }, { value: "buku_nikah", label: "Buku Nikah" }, { value: "ijazah", label: "Ijazah" }] as const;
const label = (value: string) => kinds.find((item) => item.value === value)?.label || "Dokumen lain";

export default function DocumentsScreen() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["documents"], queryFn: () => api<Document[]>("/documents") });
  const [selected, setSelected] = useState<string>("paspor");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const upload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ["image/jpeg", "image/png", "image/webp", "application/pdf"], copyToCacheDirectory: true });
    if (result.canceled) return;
    setBusy(true); setMessage("");
    const asset = result.assets[0];
    const form = new FormData(); form.append("kind", selected); form.append("file", { uri: asset.uri, name: asset.name, type: asset.mimeType || "application/octet-stream" } as unknown as Blob);
    try { await api("/documents", { method: "POST", body: form }); setMessage("Dokumen berhasil diunggah dan menunggu pemeriksaan."); await client.invalidateQueries({ queryKey: ["documents"] }); }
    catch (error) { setMessage(error instanceof ApiError ? error.message : "Dokumen gagal diunggah."); }
    setBusy(false);
  };
  const open = async (id: string, mode: "preview" | "download") => { const result = await api<{ url: string }>(`/documents/${id}?mode=${mode === "preview" ? "preview" : "download"}&format=json`); await Linking.openURL(result.url); };
  return <Screen><Title subtitle="Format JPG, PNG, WebP, atau PDF. Maksimal 10 MB.">Dokumen jamaah</Title><Section title="Unggah dokumen"><View style={styles.chips}>{kinds.map((kind) => <Pressable key={kind.value} onPress={() => setSelected(kind.value)} style={[styles.chip, selected === kind.value && styles.chipActive]}><Text style={[styles.chipText, selected === kind.value && styles.chipTextActive]}>{kind.label}</Text></Pressable>)}</View><Button label={`Unggah ${label(selected)}`} loading={busy} onPress={upload} />{message ? <Text style={styles.message}>{message}</Text> : null}</Section><Section title="File tersimpan">{query.data?.length ? query.data.map((item) => <Card key={item.id}><View style={styles.file}><Ionicons name="document-text" size={24} color={colors.gold} /><View style={{ flex: 1 }}><Text numberOfLines={1} style={styles.fileName}>{label(item.kind)} · {item.originalName}</Text><Text style={styles.fileMeta}>{item.reviewStatus === "verified" ? "Terverifikasi" : item.reviewStatus === "rejected" ? "Perlu diperbaiki" : "Menunggu pemeriksaan"}</Text></View></View><View style={styles.actions}><Pressable onPress={() => open(item.id, "preview")}><Text>Preview</Text></Pressable><Pressable onPress={() => open(item.id, "download")}><Text>Download</Text></Pressable></View></Card>) : <Empty>Belum ada dokumen yang diunggah.</Empty>}</Section></Screen>;
}
const styles = StyleSheet.create({ chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, chip: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, borderRadius: 30, paddingHorizontal: 12, paddingVertical: 9 }, chipActive: { backgroundColor: colors.navy, borderColor: colors.navy }, chipText: { color: colors.ink, fontFamily: "DMSans_500Medium", fontSize: 12 }, chipTextActive: { color: colors.white }, message: { color: colors.muted, fontFamily: "DMSans_400Regular", textAlign: "center" }, file: { flexDirection: "row", gap: 12, alignItems: "center" }, fileName: { color: colors.navy, fontFamily: "DMSans_700Bold" }, fileMeta: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 12, marginTop: 4 }, actions: { flexDirection: "row", gap: 20, justifyContent: "flex-end" } } as const);
