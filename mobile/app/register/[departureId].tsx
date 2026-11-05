import { useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useAuthStore, type Tokens } from "@/lib/auth-store";
import { findPackageDeparture } from "@/lib/package-departures";
import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  saveRegistrationDraft,
  type RegistrationDraft,
} from "@/lib/registration-draft";
import type { Package } from "@/types";
import { colors } from "@/theme";
import { RegistrationStepper } from "@/components/registration/registration-stepper";
import {
  DateField,
  GenderSelector,
  RegistrationField,
} from "@/components/registration/form-controls";
import { RegistrationFooter } from "@/components/registration/registration-footer";
import { DocumentStep } from "@/components/registration/document-step";
import { PaymentStep } from "@/components/registration/payment-step";
import { ConfirmationStep } from "@/components/registration/confirmation-step";
import {
  compareIsoDateToToday,
  parseIndonesianDateInput,
} from "@/lib/date-input";

type Profile = Omit<
  RegistrationDraft,
  | "roomType"
  | "payerSameAsPilgrim"
  | "payerName"
  | "payerWhatsapp"
  | "payerEmail"
> & { id: string };
type RegisterResult = {
  tokens: Tokens;
  user: {
    id: string;
    fullName: string;
    whatsapp: string;
    email?: string | null;
  };
};
const initialDraft: RegistrationDraft = {
  fullName: "",
  whatsapp: "",
  email: "",
  gender: "",
  birthDate: "",
  nationality: "Indonesia",
  passportNumber: "",
  passportExpiry: "",
  notes: "",
  roomType: "quad",
  payerSameAsPilgrim: true,
  payerName: "",
  payerWhatsapp: "",
  payerEmail: "",
};
const emailValid = (value: string) =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneValid = (value: string) =>
  /^(?:\+?62|0)?8\d{7,12}$/.test(value.replace(/[\s().-]/g, ""));
const fieldLabels: Record<string, string> = {
  fullName: "Nama Lengkap",
  whatsapp: "Nomor WhatsApp",
  email: "Email",
  gender: "Jenis Kelamin",
  birthDate: "Tanggal Lahir",
  nationality: "Kewarganegaraan",
  passportNumber: "Nomor Paspor",
  passportExpiry: "Masa Berlaku Paspor",
  pin: "PIN",
  pinConfirm: "Konfirmasi PIN",
};
const profileFieldOrder = Object.keys(fieldLabels);

export default function RegistrationScreen() {
  const { departureId } = useLocalSearchParams<{ departureId: string }>();
  const tokens = useAuthStore((state) => state.tokens);
  const draftOwnerId = useAuthStore((state) => state.user?.id ?? "guest");
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
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const fieldPositions = useRef<Record<string, number>>({});
  const previousDraftOwnerId = useRef(draftOwnerId);
  const readyDraftOwnerId = useRef<string | null>(null);
  const packages = useQuery({
    queryKey: ["packages", "registration"],
    queryFn: () => api<Package[]>("/packages"),
  });
  const profile = useQuery({
    queryKey: ["me"],
    queryFn: () => api<Profile>("/me"),
    enabled: Boolean(tokens),
  });
  const selection = useMemo(
    () => findPackageDeparture(packages.data, departureId),
    [packages.data, departureId],
  );
  const packageItem = selection?.packageItem;
  const selectedDeparture = selection?.departure;

  useEffect(() => {
    if (!departureId) return;
    const previousOwnerId = previousDraftOwnerId.current;
    const preserveGuestRegistration =
      previousOwnerId === "guest" && draftOwnerId !== "guest";
    previousDraftOwnerId.current = draftOwnerId;
    readyDraftOwnerId.current = null;
    let active = true;
    // The persisted draft is an external store synchronized into form state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftReady(false);
    if (!preserveGuestRegistration && previousOwnerId !== draftOwnerId)
      setDraft(initialDraft);
    void loadRegistrationDraft(departureId, draftOwnerId).then((saved) => {
      if (!active) return;
      if (saved) setDraft((current) => ({ ...current, ...saved }));
      readyDraftOwnerId.current = draftOwnerId;
      setDraftReady(true);
    });
    return () => {
      active = false;
    };
  }, [departureId, draftOwnerId]);
  useEffect(() => {
    if (!profile.data) return;
    // React Query is the external source being synchronized into the editable draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft((current) => ({
      ...current,
      fullName: profile.data.fullName,
      whatsapp: profile.data.whatsapp,
      email: profile.data.email ?? "",
      gender: profile.data.gender ?? "",
      birthDate: profile.data.birthDate ?? "",
      nationality: profile.data.nationality || "Indonesia",
      passportNumber: profile.data.passportNumber ?? "",
      passportExpiry: profile.data.passportExpiry ?? "",
    }));
  }, [draftReady, profile.data]);
  useEffect(() => {
    if (draftReady && departureId && readyDraftOwnerId.current === draftOwnerId)
      void saveRegistrationDraft(departureId, draftOwnerId, draft);
  }, [departureId, draft, draftOwnerId, draftReady]);

  const update = (value: Partial<RegistrationDraft>) => {
    setDraft((current) => ({ ...current, ...value }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(value).forEach((key) => delete next[key]);
      return next;
    });
  };
  const scrollToFirstError = (nextErrors: Record<string, string>) => {
    const first = profileFieldOrder.find((key) => nextErrors[key]);
    if (!first) return;
    setTimeout(
      () =>
        scrollRef.current?.scrollTo({
          y: Math.max(0, (fieldPositions.current[first] ?? 0) - 18),
          animated: true,
        }),
      50,
    );
  };
  const describeErrors = (nextErrors: Record<string, string>) => {
    const labels = profileFieldOrder
      .filter((key) => nextErrors[key])
      .map((key) => fieldLabels[key]);
    return labels.length
      ? `Periksa kembali: ${labels.join(", ")}.`
      : "Periksa kembali data jamaah Anda.";
  };
  const validateProfile = () => {
    const next: Record<string, string> = {};
    if (draft.fullName.trim().length < 2)
      next.fullName = "Nama jamaah wajib diisi.";
    if (!phoneValid(draft.whatsapp))
      next.whatsapp = "Nomor WhatsApp tidak valid.";
    if (!emailValid(draft.email)) next.email = "Format email tidak valid.";
    if (!draft.gender) next.gender = "Jenis kelamin wajib dipilih.";
    const birthDate = draft.birthDate
      ? parseIndonesianDateInput(draft.birthDate)
      : null;
    if (draft.birthDate && !birthDate)
      next.birthDate = "Format tanggal lahir tidak valid (contoh: 10-02-1977).";
    else if (birthDate && compareIsoDateToToday(birthDate) > 0)
      next.birthDate = "Tanggal lahir tidak boleh di masa depan.";
    if (draft.nationality.trim().length < 2)
      next.nationality = "Kewarganegaraan wajib diisi.";
    if (draft.passportNumber.trim().length > 40)
      next.passportNumber = "Nomor paspor maksimal 40 karakter.";
    const passportExpiry = draft.passportExpiry
      ? parseIndonesianDateInput(draft.passportExpiry)
      : null;
    if (draft.passportExpiry && !passportExpiry)
      next.passportExpiry =
        "Format masa berlaku paspor tidak valid (contoh: 10-02-2030).";
    else if (passportExpiry && compareIsoDateToToday(passportExpiry) <= 0)
      next.passportExpiry = "Masa berlaku paspor harus setelah hari ini.";
    if (!tokens && !/^\d{6}$/.test(pin))
      next.pin = "PIN harus terdiri dari 6 angka.";
    if (!tokens && pin !== pinConfirm)
      next.pinConfirm = "Konfirmasi PIN tidak sama.";
    setErrors(next);
    if (Object.keys(next).length) {
      setMessage(describeErrors(next));
      scrollToFirstError(next);
      return null;
    }
    return {
      birthDate: birthDate ?? undefined,
      passportExpiry: passportExpiry ?? undefined,
    };
  };
  const continueProfile = async () => {
    if (!selection || !selectedDeparture?.selectable) {
      setMessage(
        "Keberangkatan ini belum tersedia untuk pendaftaran. Silakan kembali dan pilih jadwal lain.",
      );
      return;
    }
    const normalizedDates = validateProfile();
    if (!normalizedDates) return;
    setBusy(true);
    setMessage("");
    const profilePayload = {
      fullName: draft.fullName,
      whatsapp: draft.whatsapp,
      email: draft.email,
      gender: draft.gender || undefined,
      birthDate: normalizedDates.birthDate,
      nationality: draft.nationality,
      passportNumber: draft.passportNumber || undefined,
      passportExpiry: normalizedDates.passportExpiry,
      notes: draft.notes || undefined,
    };
    try {
      if (tokens) {
        const result = await api<Profile>("/me", {
          method: "PATCH",
          body: JSON.stringify(profilePayload),
        });
        setUser({
          id: result.id,
          fullName: result.fullName,
          whatsapp: result.whatsapp,
          email: result.email,
        });
      } else {
        const result = await api<RegisterResult>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ ...profilePayload, pin }),
        });
        await signIn(result.tokens, result.user);
        update({ whatsapp: result.user.whatsapp });
      }
      setStep(2);
    } catch (error) {
      if (error instanceof ApiError) {
        const fieldErrors = Object.fromEntries(
          Object.entries(error.fieldErrors ?? {}).map(([key, values]) => [
            key,
            values[0],
          ]),
        );
        setErrors(fieldErrors);
        setMessage(
          Object.keys(fieldErrors).length
            ? describeErrors(fieldErrors)
            : error.message,
        );
        scrollToFirstError(fieldErrors);
      } else setMessage("Data jamaah gagal disimpan. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  };
  const validatePayment = () => {
    if (draft.payerSameAsPilgrim) return true;
    const next: Record<string, string> = {};
    if (draft.payerName.trim().length < 2)
      next.payerName = "Nama pembayar wajib diisi.";
    if (!phoneValid(draft.payerWhatsapp))
      next.payerWhatsapp = "Nomor WhatsApp pembayar tidak valid.";
    if (!emailValid(draft.payerEmail))
      next.payerEmail = "Format email pembayar tidak valid.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = async () => {
    if (!departureId || !packageItem) {
      setMessage(
        "Paket keberangkatan belum dapat dimuat. Silakan kembali dan pilih paket lagi.",
      );
      return;
    }
    setBusy(true);
    setMessage("");
    const payerName = draft.payerSameAsPilgrim
      ? draft.fullName
      : draft.payerName;
    const payerWhatsapp = draft.payerSameAsPilgrim
      ? draft.whatsapp
      : draft.payerWhatsapp;
    const payerEmail = draft.payerSameAsPilgrim
      ? draft.email
      : draft.payerEmail;
    try {
      const result = await api<{ registrationId: string }>("/registrations", {
        method: "POST",
        body: JSON.stringify({
          departureId,
          roomType: draft.roomType,
          payerName,
          payerWhatsapp,
          payerEmail,
          note: draft.notes,
        }),
      });
      await clearRegistrationDraft(departureId, draftOwnerId);
      router.replace(`/payment/${result.registrationId}` as never);
    } catch (error) {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Pendaftaran gagal dikirim. Silakan coba lagi.",
      );
    } finally {
      setBusy(false);
    }
  };
  const next = () => {
    setMessage("");
    if (step === 1) void continueProfile();
    else if (step === 2) setStep(3);
    else if (step === 3 && validatePayment()) setStep(4);
    else if (step === 4) void submit();
  };
  const back = () => {
    if (step === 1) router.back();
    else setStep((current) => current - 1);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.safe}>
        <View style={styles.appBar}>
          <Pressable onPress={back} hitSlop={12} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={23} color={colors.navy} />
          </Pressable>
          <Text style={styles.appTitle}>Pendaftaran</Text>
          <View style={styles.iconButton} />
        </View>
        <RegistrationStepper current={step} />
        {message ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
            <Text style={styles.errorText}>{message}</Text>
          </View>
        ) : null}
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          {step === 1 ? (
            tokens && (!draftReady || profile.isLoading) ? (
              <View style={styles.profileState}>
                <Text style={styles.sectionTitle}>Data Jamaah</Text>
                <Text style={styles.sectionCopy}>
                  Mengambil data profil Anda…
                </Text>
              </View>
            ) : tokens && profile.isError ? (
              <View style={styles.profileState}>
                <Ionicons
                  name="alert-circle-outline"
                  size={28}
                  color={colors.danger}
                />
                <Text style={styles.sectionTitle}>
                  Profil belum dapat dimuat
                </Text>
                <Text style={styles.sectionCopy}>
                  Coba muat kembali agar data jamaah tidak perlu diisi ulang.
                </Text>
                <Pressable
                  onPress={() => void profile.refetch()}
                  style={styles.retry}
                >
                  <Text style={styles.retryText}>Muat Ulang Profil</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.form}>
                <View>
                  <Text style={styles.sectionTitle}>Data Jamaah</Text>
                  <Text style={styles.sectionCopy}>
                    {tokens
                      ? "Data diisi otomatis dari profil Anda. Periksa kembali jika ada perubahan."
                      : "Isi sesuai data resmi. Field berikut sama dengan data jamaah di dashboard Jam Wisata."}
                  </Text>
                </View>
                {!tokens ? (
                  <View style={styles.loginNote}>
                    <Text style={styles.loginCopy}>
                      Sudah punya akun jamaah?
                    </Text>
                    <Pressable
                      onPress={() =>
                        router.push(
                          `/login?next=${encodeURIComponent(`/register/${departureId}`)}` as never,
                        )
                      }
                    >
                      <Text style={styles.loginLink}>Masuk di sini</Text>
                    </Pressable>
                  </View>
                ) : null}
                <View onLayout={(event) => { fieldPositions.current.fullName = event.nativeEvent.layout.y; }}>
                  <RegistrationField label="Nama Lengkap" value={draft.fullName} onChangeText={(fullName) => update({ fullName })} error={errors.fullName} placeholder="Sesuai paspor atau identitas resmi" autoComplete="name" />
                </View>
                <View onLayout={(event) => { fieldPositions.current.whatsapp = event.nativeEvent.layout.y; }}>
                  <RegistrationField label="Nomor WhatsApp" value={draft.whatsapp} onChangeText={(whatsapp) => update({ whatsapp })} error={errors.whatsapp} placeholder="0812xxxx" keyboardType="phone-pad" autoComplete="tel" />
                </View>
                <View onLayout={(event) => { fieldPositions.current.email = event.nativeEvent.layout.y; }}>
                  <RegistrationField label="Email" optional value={draft.email} onChangeText={(email) => update({ email })} error={errors.email} placeholder="nama@email.com" keyboardType="email-address" autoCapitalize="none" />
                </View>
                <View onLayout={(event) => { fieldPositions.current.gender = event.nativeEvent.layout.y; }}>
                  <GenderSelector value={draft.gender} onChange={(gender) => update({ gender })} error={errors.gender} />
                </View>
                <View onLayout={(event) => { fieldPositions.current.birthDate = event.nativeEvent.layout.y; }}>
                  <DateField label="Tanggal Lahir" optional value={draft.birthDate} onChange={(birthDate) => update({ birthDate })} error={errors.birthDate} />
                </View>
                <View onLayout={(event) => { fieldPositions.current.nationality = event.nativeEvent.layout.y; }}>
                  <RegistrationField label="Kewarganegaraan" value={draft.nationality} onChangeText={(nationality) => update({ nationality })} error={errors.nationality} />
                </View>
                <View onLayout={(event) => { fieldPositions.current.passportNumber = event.nativeEvent.layout.y; }}>
                  <RegistrationField label="Nomor Paspor" optional value={draft.passportNumber} onChangeText={(passportNumber) => update({ passportNumber: passportNumber.toUpperCase() })} error={errors.passportNumber} placeholder="Isi jika sudah tersedia" autoCapitalize="characters" maxLength={40} />
                </View>
                <View onLayout={(event) => { fieldPositions.current.passportExpiry = event.nativeEvent.layout.y; }}>
                  <DateField label="Masa Berlaku Paspor" optional value={draft.passportExpiry} onChange={(passportExpiry) => update({ passportExpiry })} error={errors.passportExpiry} />
                </View>
                <RegistrationField
                  label="Catatan"
                  optional
                  value={draft.notes}
                  onChangeText={(notes) => update({ notes })}
                  placeholder="Kebutuhan khusus atau catatan untuk admin"
                  multiline
                  maxLength={500}
                />
                {!tokens ? (
                  <View style={styles.pinBox} onLayout={(event) => { fieldPositions.current.pin = event.nativeEvent.layout.y; fieldPositions.current.pinConfirm = event.nativeEvent.layout.y; }}>
                    <Text style={styles.pinTitle}>Buat akun jamaah</Text>
                    <Text style={styles.pinCopy}>
                      PIN ini dipakai untuk melihat dokumen, pembayaran, dan
                      perjalanan Anda setelah mendaftar.
                    </Text>
                    <View>
                      <RegistrationField label="PIN 6 Angka" value={pin} onChangeText={setPin} error={errors.pin} keyboardType="number-pad" secureTextEntry maxLength={6} placeholder="••••••" />
                    </View>
                    <View>
                      <RegistrationField label="Ulangi PIN" value={pinConfirm} onChangeText={setPinConfirm} error={errors.pinConfirm} keyboardType="number-pad" secureTextEntry maxLength={6} placeholder="••••••" />
                    </View>
                  </View>
                ) : null}
              </View>
            )
          ) : null}
          {step === 2 ? <DocumentStep /> : null}
          {step === 3 ? (
            <PaymentStep
              packageItem={packageItem}
              departure={selectedDeparture}
              draft={draft}
              update={update}
              errors={errors}
            />
          ) : null}
          {step === 4 ? (
            <ConfirmationStep
              packageItem={packageItem}
              departure={selectedDeparture}
              draft={draft}
            />
          ) : null}
        </ScrollView>
        <RegistrationFooter
          label={step === 4 ? "Konfirmasi Pendaftaran" : "Lanjutkan"}
          onPress={next}
          onBack={step > 1 ? back : undefined}
          busy={busy}
          disabled={
            packages.isLoading ||
            packages.isError ||
            !selection ||
            !selectedDeparture?.selectable ||
            (step === 1 &&
              Boolean(tokens) &&
              (!draftReady || profile.isLoading || profile.isError))
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: colors.ivory,
    paddingTop: Platform.OS === "android" ? 18 : 0,
  },
  appBar: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    color: colors.navy,
    fontFamily: "Montserrat_700Bold",
    fontSize: 21,
  },
  content: { paddingHorizontal: 19, paddingTop: 10, paddingBottom: 30 },
  form: { gap: 16 },
  profileState: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  retry: {
    marginTop: 8,
    minHeight: 44,
    borderRadius: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.navy,
  },
  retryText: {
    color: colors.white,
    fontFamily: "Montserrat_700Bold",
    fontSize: 13,
  },
  sectionTitle: {
    color: colors.navy,
    fontFamily: "Cinzel_700Bold",
    fontSize: 24,
  },
  sectionCopy: {
    marginTop: 5,
    color: colors.muted,
    fontFamily: "Montserrat_400Regular",
    fontSize: 13.5,
    lineHeight: 20,
  },
  loginNote: {
    minHeight: 48,
    paddingHorizontal: 13,
    borderRadius: 13,
    backgroundColor: "#F4E9D5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  loginCopy: {
    color: colors.muted,
    fontFamily: "Montserrat_400Regular",
    fontSize: 13,
  },
  loginLink: {
    color: colors.navy,
    fontFamily: "Montserrat_700Bold",
    fontSize: 13,
  },
  pinBox: {
    gap: 14,
    marginTop: 4,
    padding: 16,
    borderRadius: 17,
    backgroundColor: "#F3EAD9",
  },
  pinTitle: {
    color: colors.navy,
    fontFamily: "Montserrat_700Bold",
    fontSize: 17,
  },
  pinCopy: {
    color: colors.muted,
    fontFamily: "Montserrat_400Regular",
    fontSize: 12.5,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: "row",
    gap: 9,
    marginHorizontal: 19,
    marginTop: 8,
    padding: 13,
    borderRadius: 13,
    backgroundColor: "#FDECEC",
  },
  errorText: {
    flex: 1,
    color: colors.danger,
    fontFamily: "Montserrat_500Medium",
    fontSize: 12.5,
    lineHeight: 18,
  },
});
