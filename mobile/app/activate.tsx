import { useState } from "react";
import { Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, Field, Screen, Title } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { useAuthStore, type Tokens } from "@/lib/auth-store";
import { colors } from "@/theme";

const schema = z.object({ pin: z.string().regex(/^\d{6}$/, "PIN harus terdiri dari 6 angka."), confirmation: z.string() }).refine((value) => value.pin === value.confirmation, { path: ["confirmation"], message: "Konfirmasi PIN belum sama." });
type Values = z.infer<typeof schema>;

export default function ActivateScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const signIn = useAuthStore((state) => state.signIn);
  const [message, setMessage] = useState("");
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { pin: "", confirmation: "" } });
  const submit = handleSubmit(async ({ pin }) => {
    if (!token) return setMessage("Link aktivasi tidak lengkap. Minta link baru kepada admin.");
    try { const result = await api<{ tokens: Tokens; user: { id: string; fullName: string; whatsapp: string } }>("/auth/activate", { method: "POST", body: JSON.stringify({ token, pin }) }); await signIn(result.tokens, result.user); router.replace("/(tabs)"); }
    catch (error) { setMessage(error instanceof ApiError ? error.message : "Aktivasi gagal. Silakan coba lagi."); }
  });
  return <Screen><Title subtitle="Buat PIN 6 angka untuk masuk berikutnya.">Aktifkan akun</Title><Card><Controller control={control} name="pin" render={({ field }) => <Field label="PIN baru" keyboardType="number-pad" secureTextEntry maxLength={6} value={field.value} onChangeText={field.onChange} error={errors.pin?.message} />} /><Controller control={control} name="confirmation" render={({ field }) => <Field label="Ulangi PIN" keyboardType="number-pad" secureTextEntry maxLength={6} value={field.value} onChangeText={field.onChange} error={errors.confirmation?.message} />} />{message ? <Text style={{ color: colors.danger }}>{message}</Text> : null}<Button label="Aktifkan aplikasi" onPress={submit} loading={isSubmitting} /></Card></Screen>;
}
