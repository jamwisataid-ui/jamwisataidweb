import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";
import { useAuthStore, type Tokens } from "@/lib/auth-store";
import { Button, Field, Screen } from "@/components/ui";
import { colors } from "@/theme";

const schema = z.object({ whatsapp: z.string().min(9, "Masukkan nomor WhatsApp."), pin: z.string().regex(/^\d{6}$/, "PIN harus 6 angka.") });
type Values = z.infer<typeof schema>;

export default function LoginScreen() {
  const { next } = useLocalSearchParams<{ next?: string }>();
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
  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}><Screen><View style={styles.hero}><Text style={styles.kicker}>JARIS AMMAR MADANI</Text><Text style={styles.brand}>JAM WISATA</Text><Text style={styles.tagline}>Setiap Waktu Bernilai Ibadah</Text></View><View style={styles.form}><Text style={styles.heading}>Assalamu’alaikum</Text><Text style={styles.copy}>Masuk dengan nomor WhatsApp yang terdaftar dan PIN 6 angka Anda.</Text><Controller control={control} name="whatsapp" render={({ field }) => <Field label="Nomor WhatsApp" keyboardType="phone-pad" autoComplete="tel" value={field.value} onChangeText={field.onChange} error={errors.whatsapp?.message} placeholder="08xxxxxxxxxx" />} /><Controller control={control} name="pin" render={({ field }) => <Field label="PIN" keyboardType="number-pad" secureTextEntry maxLength={6} value={field.value} onChangeText={field.onChange} error={errors.pin?.message} placeholder="••••••" />} />{message ? <Text style={styles.error}>{message}</Text> : null}<Button label="Masuk" onPress={submit} loading={isSubmitting} /><Button secondary label="Lanjut sebagai tamu" onPress={() => router.replace("/(tabs)")} /><Pressable onPress={() => router.push("/muthowif/login" as never)}><Text style={styles.staffLogin}>Masuk sebagai Muthowif</Text></Pressable><Text style={styles.help}>Belum punya akun? Pilih paket sebagai tamu, lalu isi data jamaah dan buat PIN saat mulai mendaftar.</Text></View></Screen></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ hero: { marginHorizontal: -20, marginTop: -20, padding: 28, minHeight: 220, justifyContent: "flex-end", backgroundColor: colors.navy, borderBottomLeftRadius: 34, borderBottomRightRadius: 34 }, kicker: { color: colors.softGold, fontFamily: "Montserrat_700Bold", fontSize: 11, letterSpacing: 2 }, brand: { color: colors.white, fontFamily: "Cinzel_700Bold", fontSize: 38, marginTop: 6 }, tagline: { color: colors.softGold, fontFamily: "Montserrat_400Regular", fontSize: 14 }, form: { gap: 16 }, heading: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 28 }, copy: { color: colors.muted, fontFamily: "Montserrat_400Regular", lineHeight: 22 }, error: { color: colors.danger, fontFamily: "Montserrat_500Medium" }, staffLogin: { color: colors.navy, textAlign: "center", fontFamily: "Montserrat_700Bold", fontSize: 14, textDecorationLine: "underline" }, help: { color: colors.muted, textAlign: "center", fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 19 } } as const);
