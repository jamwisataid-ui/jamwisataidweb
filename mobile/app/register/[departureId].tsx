import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { api, ApiError } from "@/lib/api";
import { Button, Card, Screen, Title } from "@/components/ui";
import { colors } from "@/theme";

const rooms = [{ value: "quad", label: "Quad" }, { value: "triple", label: "Triple" }, { value: "double", label: "Double" }] as const;
export default function RegisterScreen() {
  const { departureId } = useLocalSearchParams<{ departureId: string }>();
  const [roomType, setRoomType] = useState<"quad" | "triple" | "double">("quad");
  const [note, setNote] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const submit = async () => { setBusy(true); setMessage(""); try { await api("/registrations", { method: "POST", body: JSON.stringify({ departureId, roomType, note }) }); router.replace("/journey"); } catch (error) { setMessage(error instanceof ApiError ? error.message : "Pendaftaran gagal dikirim."); } setBusy(false); };
  return <Screen><Title subtitle="Permintaan akan diperiksa admin sebelum menjadi pendaftaran aktif.">Ajukan pendaftaran</Title><Card><Text style={styles.label}>Pilihan kamar</Text><View style={styles.rooms}>{rooms.map((room) => <Pressable key={room.value} onPress={() => setRoomType(room.value)} style={[styles.room, roomType === room.value && styles.active]}><Text style={roomType === room.value && { color: colors.white }}>{room.label}</Text></Pressable>)}</View><Text style={styles.label}>Catatan (opsional)</Text><TextInput multiline value={note} onChangeText={setNote} maxLength={500} placeholder="Kebutuhan khusus atau catatan untuk admin" style={styles.note} />{message ? <Text style={styles.error}>{message}</Text> : null}<Button label="Kirim permintaan" loading={busy} onPress={submit} /></Card></Screen>;
}
const styles = StyleSheet.create({ label: { color: colors.navy, fontFamily: "DMSans_700Bold" }, rooms: { flexDirection: "row", gap: 8 }, room: { flex: 1, alignItems: "center", borderWidth: 1, borderColor: colors.line, padding: 12, borderRadius: 12 }, active: { backgroundColor: colors.navy, borderColor: colors.navy }, note: { minHeight: 100, borderWidth: 1, borderColor: colors.line, borderRadius: 13, padding: 13, textAlignVertical: "top", fontFamily: "DMSans_400Regular" }, error: { color: colors.danger, fontFamily: "DMSans_500Medium" } } as const);
