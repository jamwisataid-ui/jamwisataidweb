import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { Button, Field, Screen } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { type Tokens, useAuthStore } from "@/lib/auth-store";
import { colors, typography } from "@/theme";

const schema = z.object({ email: z.email("Format email tidak valid."), password: z.string().min(10, "Kata sandi minimal 10 karakter.") });
type Values = z.infer<typeof schema>;

export default function MuthowifLoginScreen() {
  const signIn = useAuthStore((state) => state.signIn);
  const [message, setMessage] = useState("");
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const submit = handleSubmit(async (values) => {
    setMessage("");
    try {
      const result = await api<{ tokens: Tokens; user: { id: string; fullName: string; email: string; role: "muthowif" } }>("/auth/muthowif/login", { method: "POST", body: JSON.stringify(values) });
      await signIn(result.tokens, result.user);
      router.replace("/muthowif/live" as never);
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "Tidak dapat terhubung ke server.");
    }
  });
  return <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}><Screen>
    <Pressable onPress={() => router.back()}><Text style={styles.back}>← Kembali</Text></Pressable>
    <View style={styles.hero}><Text style={styles.eyebrow}>AKSES PETUGAS</Text><Text style={styles.title}>Panel Muthowif</Text><Text style={styles.copy}>Masuk menggunakan akun muthowif resmi Jam Wisata.</Text></View>
    <View style={styles.form}>
      <Controller control={control} name="email" render={({ field }) => <Field label="Email" keyboardType="email-address" autoCapitalize="none" value={field.value} onChangeText={field.onChange} error={errors.email?.message} placeholder="muthowif@jamwisata.com" />} />
      <Controller control={control} name="password" render={({ field }) => <Field label="Kata Sandi" secureTextEntry value={field.value} onChangeText={field.onChange} error={errors.password?.message} placeholder="••••••••••" />} />
      {message ? <Text style={styles.error}>{message}</Text> : null}
      <Button label="Masuk ke Panel" loading={isSubmitting} onPress={submit} />
    </View>
  </Screen></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({ root: { flex: 1 }, back: { color: colors.navy, fontFamily: typography.semibold, fontSize: 14 }, hero: { backgroundColor: colors.navy, borderRadius: 24, padding: 24, gap: 8 }, eyebrow: { color: colors.softGold, fontFamily: typography.bold, fontSize: 11, letterSpacing: 2 }, title: { color: colors.white, fontFamily: typography.heading, fontSize: 30 }, copy: { color: "rgba(255,255,255,.74)", fontFamily: typography.body, lineHeight: 21 }, form: { gap: 16 }, error: { color: colors.danger, fontFamily: typography.medium, fontSize: 13 } });
