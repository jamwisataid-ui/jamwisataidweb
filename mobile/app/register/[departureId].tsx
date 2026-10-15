import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useAuthStore, type Tokens } from "@/lib/auth-store";
import { clearRegistrationDraft, loadRegistrationDraft, saveRegistrationDraft, type RegistrationDraft } from "@/lib/registration-draft";
import type { Package } from "@/types";
import { colors } from "@/theme";
import { RegistrationStepper } from "@/components/registration/registration-stepper";
import { DateField, GenderSelector, RegistrationField } from "@/components/registration/form-controls";
import { RegistrationFooter } from "@/components/registration/registration-footer";
import { DocumentStep } from "@/components/registration/document-step";
import { PaymentStep } from "@/components/registration/payment-step";
import { ConfirmationStep } from "@/components/registration/confirmation-step";

type Profile = Omit<RegistrationDraft, "roomType" | "payerSameAsPilgrim" | "payerName" | "payerWhatsapp" | "payerEmail"> & { id: string };
type RegisterResult = { tokens: Tokens; user: { id: string; fullName: string; whatsapp: string; email?: string | null } };
const initialDraft: RegistrationDraft = { fullName: "", whatsapp: "", email: "", gender: "", birthDate: "", nationality: "Indonesia", passportNumber: "", passportExpiry: "", notes: "", roomType: "quad", payerSameAsPilgrim: true, payerName: "", payerWhatsapp: "", payerEmail: "" };
const emailValid = (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneValid = (value: string) => /^(?:\+?62|0)?8\d{7,12}$/.test(value.replace(/[\s().-]/g, ""));

export default function RegistrationScreen() {
  const { departureId } = useLocalSearchParams<{ departureId: string }>();
  const tokens = useAuthStore((state) => state.tokens);
  const signIn = useAuthStore((state) => state.signIn);
  const setUser = useAuthStore((state) => state.setUser);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(initialDraft);
  const [draftReady, setDraftReady] = useState(false);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const packages = useQuery({ queryKey: ["packages", "registration"], queryFn: () => api<Package[]>("/packages") });
  const profile = useQuery({ queryKey: ["me"], queryFn: () => api<Profile>("/me"), enabled: Boolean(tokens) });
  const packageItem = useMemo(() => packages.data?.find((item) => item.departureId === departureId), [packages.data, departureId]);

  useEffect(() => { if (!departureId) return; void loadRegistrationDraft(departureId).then((saved) => { if (saved) setDraft((current) => ({ ...current, ...saved })); setDraftReady(true); }); }, [departureId]);
  useEffect(() => {
    if (!profile.data) return;
    // React Query is the external source being synchronized into the editable draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft((current) => ({ ...current, fullName: profile.data.fullName, whatsapp: profile.data.whatsapp, email: profile.data.email ?? "", gender: profile.data.gender ?? "", birthDate: profile.data.birthDate ?? "", nationality: profile.data.nationality || "Indonesia", passportNumber: profile.data.passportNumber ?? "", passportExpiry: profile.data.passportExpiry ?? "" }));
  }, [draftReady, profile.data]);
  useEffect(() => { if (draftReady && departureId) void saveRegistrationDraft(departureId, draft); }, [departureId, draft, draftReady]);

  const update = (value: Partial<RegistrationDraft>) => { setDraft((current) => ({ ...current, ...value })); setErrors((current) => { const next = { ...current }; Object.keys(value).forEach((key) => delete next[key]); return next; }); };
  const profilePayload = { fullName: draft.fullName, whatsapp: draft.whatsapp, email: draft.email, gender: draft.gender || undefined, birthDate: draft.birthDate || undefined, nationality: draft.nationality, passportNumber: draft.passportNumber || undefined, passportExpiry: draft.passportExpiry || undefined, notes: draft.notes || undefined };
  const validateProfile = () => {
    const next: Record<string, string> = {};
    if (draft.fullName.trim().length < 2) next.fullName = "Nama jamaah wajib diisi.";
    if (!phoneValid(draft.whatsapp)) next.whatsapp = "Nomor WhatsApp tidak valid.";
    if (!emailValid(draft.email)) next.email = "Format email tidak valid.";
    if (draft.nationality.trim().length < 2) next.nationality = "Kewarganegaraan wajib diisi.";
    if (!tokens && !/^\d{6}$/.test(pin)) next.pin = "PIN harus terdiri dari 6 angka.";
    if (!tokens && pin !== pinConfirm) next.pinConfirm = "Konfirmasi PIN tidak sama.";
    setErrors(next); return Object.keys(next).length === 0;
  };
  const continueProfile = async () => {
    if (!validateProfile()) return;
    setBusy(true); setMessage("");
    try {
      if (tokens) {
        const result = await api<Profile>("/me", { method: "PATCH", body: JSON.stringify(profilePayload) });
        setUser({ id: result.id, fullName: result.fullName, whatsapp: result.whatsapp, email: result.email });
      } else {
        const result = await api<RegisterResult>("/auth/register", { method: "POST", body: JSON.stringify({ ...profilePayload, pin }) });
        await signIn(result.tokens, result.user); update({ whatsapp: result.user.whatsapp });
      }
      setStep(2);
    } catch (error) {
      if (error instanceof ApiError) { setMessage(error.message); setErrors(Object.fromEntries(Object.entries(error.fieldErrors ?? {}).map(([key, values]) => [key, values[0]]))); }
      else setMessage("Data jamaah gagal disimpan. Silakan coba lagi.");
    } finally { setBusy(false); }
  };
  const validatePayment = () => {
    if (draft.payerSameAsPilgrim) return true;
    const next: Record<string, string> = {};
    if (draft.payerName.trim().length < 2) next.payerName = "Nama pembayar wajib diisi.";
    if (!phoneValid(draft.payerWhatsapp)) next.payerWhatsapp = "Nomor WhatsApp pembayar tidak valid.";
    if (!emailValid(draft.payerEmail)) next.payerEmail = "Format email pembayar tidak valid.";
    setErrors(next); return Object.keys(next).length === 0;
  };
  const submit = async () => {
    if (!departureId || !packageItem) { setMessage("Paket keberangkatan belum dapat dimuat. Silakan kembali dan pilih paket lagi."); return; }
    setBusy(true); setMessage("");
    const payerName = draft.payerSameAsPilgrim ? draft.fullName : draft.payerName;
    const payerWhatsapp = draft.payerSameAsPilgrim ? draft.whatsapp : draft.payerWhatsapp;
    const payerEmail = draft.payerSameAsPilgrim ? draft.email : draft.payerEmail;
    try { const result = await api<{ registrationId: string }>("/registrations", { method: "POST", body: JSON.stringify({ departureId, roomType: draft.roomType, payerName, payerWhatsapp, payerEmail, note: draft.notes }) }); await clearRegistrationDraft(departureId); router.replace(`/payment/${result.registrationId}` as never); }
    catch (error) { setMessage(error instanceof ApiError ? error.message : "Pendaftaran gagal dikirim. Silakan coba lagi."); }
    finally { setBusy(false); }
  };
  const next = () => { setMessage(""); if (step === 1) void continueProfile(); else if (step === 2) setStep(3); else if (step === 3 && validatePayment()) setStep(4); else if (step === 4) void submit(); };
  const back = () => { if (step === 1) router.back(); else setStep((current) => current - 1); };

  return <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}><View style={styles.safe}><View style={styles.appBar}><Pressable onPress={back} hitSlop={12} style={styles.iconButton}><Ionicons name="arrow-back" size={23} color={colors.navy} /></Pressable><Text style={styles.appTitle}>Pendaftaran</Text><View style={styles.iconButton} /></View><RegistrationStepper current={step} /><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    {step === 1 ? tokens && (!draftReady || profile.isLoading) ? <View style={styles.profileState}><Text style={styles.sectionTitle}>Data Jamaah</Text><Text style={styles.sectionCopy}>Mengambil data profil Anda…</Text></View> : tokens && profile.isError ? <View style={styles.profileState}><Ionicons name="alert-circle-outline" size={28} color={colors.danger} /><Text style={styles.sectionTitle}>Profil belum dapat dimuat</Text><Text style={styles.sectionCopy}>Coba muat kembali agar data jamaah tidak perlu diisi ulang.</Text><Pressable onPress={() => void profile.refetch()} style={styles.retry}><Text style={styles.retryText}>Muat Ulang Profil</Text></Pressable></View> : <View style={styles.form}><View><Text style={styles.sectionTitle}>Data Jamaah</Text><Text style={styles.sectionCopy}>{tokens ? "Data diisi otomatis dari profil Anda. Periksa kembali jika ada perubahan." : "Isi sesuai data resmi. Field berikut sama dengan data jamaah di dashboard Jam Wisata."}</Text></View>{!tokens ? <View style={styles.loginNote}><Text style={styles.loginCopy}>Sudah punya akun jamaah?</Text><Pressable onPress={() => router.push(`/login?next=${encodeURIComponent(`/register/${departureId}`)}` as never)}><Text style={styles.loginLink}>Masuk di sini</Text></Pressable></View> : null}<RegistrationField label="Nama Lengkap" value={draft.fullName} onChangeText={(fullName) => update({ fullName })} error={errors.fullName} placeholder="Sesuai paspor atau identitas resmi" autoComplete="name" /><RegistrationField label="Nomor WhatsApp" value={draft.whatsapp} onChangeText={(whatsapp) => update({ whatsapp })} error={errors.whatsapp} placeholder="0812xxxx" keyboardType="phone-pad" autoComplete="tel" /><RegistrationField label="Email" optional value={draft.email} onChangeText={(email) => update({ email })} error={errors.email} placeholder="nama@email.com" keyboardType="email-address" autoCapitalize="none" /><GenderSelector value={draft.gender} onChange={(gender) => update({ gender })} /><DateField label="Tanggal Lahir" optional value={draft.birthDate} onChange={(birthDate) => update({ birthDate })} /><RegistrationField label="Kewarganegaraan" value={draft.nationality} onChangeText={(nationality) => update({ nationality })} error={errors.nationality} /><RegistrationField label="Nomor Paspor" optional value={draft.passportNumber} onChangeText={(passportNumber) => update({ passportNumber: passportNumber.toUpperCase() })} placeholder="Isi jika sudah tersedia" autoCapitalize="characters" /><DateField label="Masa Berlaku Paspor" optional value={draft.passportExpiry} onChange={(passportExpiry) => update({ passportExpiry })} /><RegistrationField label="Catatan" optional value={draft.notes} onChangeText={(notes) => update({ notes })} placeholder="Kebutuhan khusus atau catatan untuk admin" multiline maxLength={500} />{!tokens ? <View style={styles.pinBox}><Text style={styles.pinTitle}>Buat akun jamaah</Text><Text style={styles.pinCopy}>PIN ini dipakai untuk melihat dokumen, pembayaran, dan perjalanan Anda setelah mendaftar.</Text><RegistrationField label="PIN 6 Angka" value={pin} onChangeText={setPin} error={errors.pin} keyboardType="number-pad" secureTextEntry maxLength={6} placeholder="••••••" /><RegistrationField label="Ulangi PIN" value={pinConfirm} onChangeText={setPinConfirm} error={errors.pinConfirm} keyboardType="number-pad" secureTextEntry maxLength={6} placeholder="••••••" /></View> : null}</View> : null}
    {step === 2 ? <DocumentStep /> : null}{step === 3 ? <PaymentStep packageItem={packageItem} draft={draft} update={update} errors={errors} /> : null}{step === 4 ? <ConfirmationStep packageItem={packageItem} draft={draft} /> : null}{message ? <View style={styles.errorBox}><Ionicons name="alert-circle-outline" size={20} color={colors.danger} /><Text style={styles.errorText}>{message}</Text></View> : null}
  </ScrollView><RegistrationFooter label={step === 4 ? "Konfirmasi Pendaftaran" : "Lanjutkan"} onPress={next} onBack={step > 1 ? back : undefined} busy={busy} disabled={(step === 1 && Boolean(tokens) && (!draftReady || profile.isLoading || profile.isError)) || (step >= 3 && (packages.isLoading || packages.isError || !packageItem))} /></View></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory, paddingTop: Platform.OS === "android" ? 18 : 0 }, appBar: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 }, iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" }, appTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 21 }, content: { paddingHorizontal: 19, paddingTop: 10, paddingBottom: 30 }, form: { gap: 16 }, profileState: { minHeight: 300, alignItems: "center", justifyContent: "center", gap: 10 }, retry: { marginTop: 8, minHeight: 44, borderRadius: 13, paddingHorizontal: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy }, retryText: { color: colors.white, fontFamily: "Montserrat_700Bold", fontSize: 13 }, sectionTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 24 }, sectionCopy: { marginTop: 5, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13.5, lineHeight: 20 }, loginNote: { minHeight: 48, paddingHorizontal: 13, borderRadius: 13, backgroundColor: "#F4E9D5", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }, loginCopy: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13 }, loginLink: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 13 }, pinBox: { gap: 14, marginTop: 4, padding: 16, borderRadius: 17, backgroundColor: "#F3EAD9" }, pinTitle: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 17 }, pinCopy: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12.5, lineHeight: 18 }, errorBox: { flexDirection: "row", gap: 9, marginTop: 16, padding: 13, borderRadius: 13, backgroundColor: "#FDECEC" }, errorText: { flex: 1, color: colors.danger, fontFamily: "Montserrat_500Medium", fontSize: 12.5, lineHeight: 18 } });
