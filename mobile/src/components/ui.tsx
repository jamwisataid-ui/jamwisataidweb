import type { PropsWithChildren, ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow } from "@/theme";

export function Screen({ children, scroll = true }: PropsWithChildren<{ scroll?: boolean }>) {
  const body = scroll ? <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{children}</ScrollView> : <View style={styles.content}>{children}</View>;
  return <SafeAreaView style={styles.safe}>{body}</SafeAreaView>;
}
export function Title({ children, subtitle }: PropsWithChildren<{ subtitle?: string }>) { return <View style={{ gap: 5 }}><Text style={styles.title}>{children}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</View>; }
export function Card({ children }: PropsWithChildren) { return <View style={styles.card}>{children}</View>; }
export function Button({ label, onPress, loading, secondary, disabled }: { label: string; onPress: () => void; loading?: boolean; secondary?: boolean; disabled?: boolean }) { return <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.buttonSecondary, (pressed || disabled) && { opacity: .65 }]}>{loading ? <ActivityIndicator color={colors.navy} /> : <Text style={styles.buttonText}>{label}</Text>}</Pressable>; }
export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) { return <View style={{ gap: 7 }}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor="#9298A2" style={[styles.input, error && { borderColor: colors.danger }]} {...props} />{error ? <Text style={styles.error}>{error}</Text> : null}</View>; }
export function Empty({ children }: PropsWithChildren) { return <Card><Text style={styles.empty}>{children}</Text></Card>; }
export function Section({ title, action, children }: PropsWithChildren<{ title: string; action?: ReactNode }>) { return <View style={{ gap: 12 }}><View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text>{action}</View>{children}</View>; }
export function GuestGate({ title = "Masuk untuk melanjutkan", body, next }: { title?: string; body: string; next: string }) {
  const loginHref = `/login?next=${encodeURIComponent(next)}`;
  return <Card><View style={styles.guestIcon}><Ionicons name="lock-closed" size={25} color={colors.gold} /></View><Text style={styles.guestTitle}>{title}</Text><Text style={styles.guestBody}>{body}</Text><Button label="Masuk ke akun jamaah" onPress={() => router.push(loginHref as never)} /><Button secondary label="Kembali lihat paket" onPress={() => router.replace("/(tabs)/packages")} /></Card>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, content: { width: "100%", padding: 20, paddingBottom: 40, gap: 20 },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 30, lineHeight: 37 }, subtitle: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 17, gap: 12, borderWidth: 1, borderColor: colors.line, ...shadow },
  button: { minHeight: 52, backgroundColor: colors.gold, borderRadius: radius.button, alignItems: "center", justifyContent: "center", paddingHorizontal: 18 }, buttonSecondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line }, buttonText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 15 },
  label: { color: colors.ink, fontFamily: "Montserrat_700Bold", fontSize: 14 }, input: { minHeight: 52, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, borderRadius: radius.input, paddingHorizontal: 15, color: colors.ink, fontFamily: "Montserrat_400Regular", fontSize: 16 }, error: { color: colors.danger, fontFamily: "Montserrat_400Regular", fontSize: 13 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, sectionTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 21 },
  guestIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: "#F8F1DC", alignItems: "center", justifyContent: "center" }, guestTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 22 }, guestBody: { color: colors.muted, fontFamily: "Montserrat_400Regular", lineHeight: 22 },
  empty: { color: colors.muted, fontFamily: "Montserrat_400Regular", lineHeight: 22, textAlign: "center" },
} as const);
