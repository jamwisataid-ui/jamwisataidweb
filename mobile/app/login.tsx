import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import kaaba from "../assets/splash/kaaba-masjidil-haram.jpg";
import emblem from "../assets/splash/logo-emblem.png";
import { api, ApiError } from "@/lib/api";
import { useAuthStore, type Tokens } from "@/lib/auth-store";
import { Button, Field, GoldOrnament } from "@/components/ui";
import { colors } from "@/theme";

const schema = z.object({ whatsapp: z.string().min(9, "Masukkan nomor WhatsApp."), pin: z.string().regex(/^\d{6}$/, "PIN harus 6 angka.") });
type Values = z.infer<typeof schema>;

export default function LoginScreen() {
  const { next } = useLocalSearchParams<{ next?: string }>();
  const insets = useSafeAreaInsets();
  const signIn = useAuthStore((state) => state.signIn);
  const [message, setMessage] = useState("");
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { whatsapp: "", pin: "" } });
  const submit = handleSubmit(async (values) => {
    setMessage("");
    try {
      const result = await api<{ tokens: Tokens; user: { id: string; fullName: string; whatsapp: string } }>("/auth/login", { method: "POST", body: JSON.stringify(values) });
      await signIn(result.tokens, { ...result.user, role: "jamaah" }); router.replace(next?.startsWith("/") ? next as never : "/(tabs)");
    } catch (error) { setMessage(error instanceof ApiError ? error.message : "Tidak dapat terhubung ke server."); }
  });
  // Login is optional: closing always returns to the app as a guest.
  const close = () => router.canGoBack() ? router.back() : router.replace("/(tabs)");

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll} bounces={false}>
        <View style={[styles.hero, { paddingTop: insets.top + 28 }]}>
          <Image alt="" source={kaaba} resizeMode="cover" style={styles.heroImage} />
          <LinearGradient colors={["rgba(6,21,43,0.78)", "rgba(6,21,43,0.45)", "rgba(6,21,43,0.92)"]} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
          <Pressable accessibilityRole="button" accessibilityLabel="Tutup, lanjut sebagai tamu" hitSlop={6} onPress={close} style={[styles.close, { top: insets.top + 12 }]}>
            <Ionicons name="close" size={20} color={colors.white} />
          </Pressable>
          <Image alt="Emblem Jam Wisata" source={emblem} resizeMode="contain" style={styles.emblem} />
          <Text style={styles.kicker}>JARIS AMMAR MADANI</Text>
          <Text style={styles.brand}>JAM WISATA</Text>
          <GoldOrnament width={28} />
          <Text style={styles.tagline}>Setiap Waktu Bernilai Ibadah</Text>
        </View>

        <View style={styles.sheet}>
          <View style={styles.headingBlock}>
            <Text style={styles.salam}>Assalamu’alaikum</Text>
            <Text style={styles.heading}>Masuk ke Akun Jamaah</Text>
            <Text style={styles.copy}>Masuk dengan nomor WhatsApp yang terdaftar dan PIN 6 angka Anda.</Text>
          </View>
          <Controller control={control} name="whatsapp" render={({ field }) => <Field label="Nomor WhatsApp" keyboardType="phone-pad" autoComplete="tel" value={field.value} onChangeText={field.onChange} error={errors.whatsapp?.message} placeholder="08xxxxxxxxxx" />} />
          <Controller control={control} name="pin" render={({ field }) => <Field label="PIN" keyboardType="number-pad" secureTextEntry maxLength={6} value={field.value} onChangeText={field.onChange} error={errors.pin?.message} placeholder="••••••" />} />
          {message ? <Text style={styles.error}>{message}</Text> : null}
          <Button label="MASUK" onPress={submit} loading={isSubmitting} />
          <View style={styles.secondaryRow}>
            <View style={styles.flex}><Button secondary label="Nanti saja" onPress={close} /></View>
            <View style={styles.flex}><Button secondary icon="headset-outline" label="Muthowif" onPress={() => router.push("/muthowif/login" as never)} /></View>
          </View>
          <Text style={styles.help}>Belum punya akun? Pilih paket sebagai tamu, lalu isi data jamaah dan buat PIN saat mulai mendaftar.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  scroll: { flexGrow: 1, backgroundColor: colors.ivory },
  hero: { minHeight: 330, paddingBottom: 64, alignItems: "center", gap: 6, overflow: "hidden", backgroundColor: colors.navyDeep },
  heroImage: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.55 },
  close: { position: "absolute", right: 18, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(6,21,43,0.45)", borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" },
  emblem: { width: 84, height: 84 },
  kicker: { marginTop: 4, color: colors.softGold, fontFamily: "Cinzel_600SemiBold", fontSize: 10, letterSpacing: 3.5 },
  brand: { color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 31, letterSpacing: 5 },
  tagline: { color: "rgba(255,255,255,0.86)", fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 17 },
  sheet: { flex: 1, marginTop: -34, paddingHorizontal: 22, paddingTop: 26, paddingBottom: 36, gap: 16, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: colors.ivory },
  headingBlock: { gap: 4 },
  salam: { color: colors.goldText, fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 19 },
  heading: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 21, lineHeight: 27 },
  copy: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13.5, lineHeight: 20 },
  error: { color: colors.danger, fontFamily: "Montserrat_500Medium" },
  secondaryRow: { flexDirection: "row", gap: 10 },
  flex: { flex: 1 },
  help: { color: colors.muted, textAlign: "center", fontFamily: "Montserrat_400Regular", fontSize: 12, lineHeight: 18 },
} as const);
