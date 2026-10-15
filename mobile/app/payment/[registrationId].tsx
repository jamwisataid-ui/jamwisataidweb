import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { GuestGate } from "@/components/ui";
import { PaymentSummaryCard } from "@/components/payment/payment-summary-card";
import { PaymentMethodList } from "@/components/payment/payment-method-list";
import { PaymentInstructions, SecurityInfo } from "@/components/payment/payment-instructions";
import { MetallicGold } from "@/components/metallic-gold";
import type { PaymentDetail, PaymentMethod } from "@/components/payment/payment-types";
import { colors } from "@/theme";

export default function PaymentScreen() {
  const { registrationId } = useLocalSearchParams<{ registrationId: string }>();
  const tokens = useAuthStore((state) => state.tokens);
  const insets = useSafeAreaInsets();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["payment", registrationId], queryFn: () => api<PaymentDetail>(`/payments/${registrationId}`), enabled: Boolean(tokens && registrationId) });
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!query.data?.selectedMethod) return;
    // Synchronize the server-side booking preference into the local radio state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(query.data.selectedMethod);
  }, [query.data?.selectedMethod]);
  const choose = (method: PaymentMethod) => { if (method.enabled) { setSelected(method.id); setMessage(""); } };
  const proceed = async () => {
    if (query.data?.status === "paid") { router.replace("/journey"); return; }
    if (!selected || !registrationId) return;
    if (query.data?.selectedMethod === selected && selected === "bank_transfer") {
      const phone = (query.data.paymentContactWhatsapp || "6281809627499").replace(/\D/g, "").replace(/^0/, "62");
      const amount = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(query.data.outstanding);
      const text = `Assalamu'alaikum Admin Jam Wisata, saya ingin mengirim bukti pembayaran untuk ${query.data.packageName}, nomor booking ${query.data.bookingNumber}, senilai ${amount}.`;
      try { await Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`); }
      catch { setMessage("WhatsApp belum dapat dibuka. Silakan kirim bukti pembayaran melalui menu Bantuan."); }
      return;
    }
    setBusy(true); setMessage("");
    try { const updated = await api<PaymentDetail>(`/payments/${registrationId}`, { method: "POST", body: JSON.stringify({ method: selected }) }); client.setQueryData(["payment", registrationId], updated); await client.invalidateQueries({ queryKey: ["payments"] }); }
    catch (error) { setMessage(error instanceof ApiError ? error.message : "Pembayaran belum dapat diproses. Silakan coba kembali."); }
    finally { setBusy(false); }
  };

  if (!tokens) return <SafeAreaView style={styles.safe}><View style={styles.gate}><GuestGate title="Masuk untuk pembayaran" body="Halaman ini hanya dapat dibuka setelah akun aktif dan formulir paket berhasil didaftarkan." next={`/payment/${registrationId}`} /></View></SafeAreaView>;
  const data = query.data;
  const instructionReady = data?.status !== "paid" && selected === "bank_transfer" && data?.selectedMethod === selected;
  return <SafeAreaView style={styles.safe}><View style={styles.appBar}><Pressable onPress={() => router.back()} style={styles.iconButton}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.appTitle}>Pembayaran</Text><View style={styles.iconButton} /></View><ScrollView contentContainerStyle={styles.content}>{query.isLoading ? <View style={styles.loading}><ActivityIndicator color={colors.gold} /><Text style={styles.loadingText}>Memuat rincian pembayaran…</Text></View> : query.isError || !data ? <View style={styles.errorState}><Ionicons name="alert-circle-outline" size={32} color={colors.danger} /><Text style={styles.errorTitle}>Pembayaran belum dapat dimuat</Text><Text style={styles.errorCopy}>Periksa koneksi Anda, lalu coba kembali.</Text><Pressable onPress={() => query.refetch()} style={styles.retry}><Text style={styles.retryText}>Coba Lagi</Text></Pressable></View> : <><PaymentSummaryCard amount={data.outstanding} packageName={data.packageName} bookingNumber={data.bookingNumber} status={data.status} />{data.status !== "paid" ? <><View style={styles.section}><Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text><PaymentMethodList methods={data.methods} selected={selected} onSelect={choose} /></View><SecurityInfo /><PaymentInstructions data={data} /></> : null}{message ? <Text style={styles.errorText}>{message}</Text> : null}</>}</ScrollView>{data ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}><Pressable disabled={(data.status !== "paid" && !selected) || busy} onPress={proceed} style={({ pressed }) => [styles.cta, ((data.status !== "paid" && !selected) || pressed) && { opacity: .55 }]}><MetallicGold style={styles.ctaFill}>{busy ? <ActivityIndicator color={colors.navy} /> : <Text style={styles.ctaText}>{data.status === "paid" ? "Lihat Perjalanan" : instructionReady ? "Kirim Bukti via WhatsApp" : "Tampilkan Instruksi Pembayaran"}</Text>}</MetallicGold></Pressable></View> : null}</SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, gate: { flex: 1, padding: 20, justifyContent: "center" }, appBar: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 }, iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, appTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 21 }, content: { padding: 19, paddingBottom: 30, gap: 22 }, loading: { paddingVertical: 80, alignItems: "center", gap: 12 }, loadingText: { color: colors.muted, fontFamily: "Montserrat_400Regular" }, errorState: { paddingVertical: 60, alignItems: "center", gap: 9 }, errorTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 18 }, errorCopy: { color: colors.muted, fontFamily: "Montserrat_400Regular", textAlign: "center" }, retry: { marginTop: 8, minHeight: 44, paddingHorizontal: 22, borderRadius: 13, backgroundColor: colors.navy, justifyContent: "center" }, retryText: { color: colors.white, fontFamily: "Montserrat_700Bold" }, section: { gap: 13 }, sectionTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 20 }, errorText: { color: colors.danger, fontFamily: "Montserrat_500Medium", fontSize: 13 }, footer: { paddingHorizontal: 18, paddingTop: 11, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line }, cta: { height: 56, borderRadius: 16, overflow: "hidden" }, ctaFill: { flex: 1, alignItems: "center", justifyContent: "center" }, ctaText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 16 } });
