import type { PropsWithChildren, ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, type StyleProp, type TextInputProps, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, gradients, radius, shadow } from "@/theme";
import { MetallicGold } from "@/components/metallic-gold";
import { GlassSurface } from "@/components/glass";
import { PressableScale } from "@/components/motion";

type IconName = keyof typeof Ionicons.glyphMap;

export function Screen({ children, scroll = true, bottomInset = 40 }: PropsWithChildren<{ scroll?: boolean; bottomInset?: number }>) {
  const body = scroll ? <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>{children}</ScrollView> : <View style={styles.content}>{children}</View>;
  return <SafeAreaView style={styles.safe}>{body}</SafeAreaView>;
}

/** Small letter-spaced Cinzel label used above headings. */
export function Eyebrow({ children, dark }: PropsWithChildren<{ dark?: boolean }>) {
  return <Text style={[styles.eyebrow, dark && styles.eyebrowDark]}>{children}</Text>;
}

export function Title({ children, subtitle, eyebrow }: PropsWithChildren<{ subtitle?: string; eyebrow?: string }>) {
  return <View style={{ gap: 5 }}>{eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}<Text style={styles.title}>{children}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</View>;
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) { return <View style={[styles.card, style]}>{children}</View>; }

/** Dark navy card with a hairline gold border — the premium surface of the brand. */
export function NavyCard({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <GlassSurface variant="navyCard" radius={radius.card} style={[styles.navyCard, style]}>
      {children}
    </GlassSurface>
  );
}

export function Button({ label, onPress, loading, secondary, disabled, icon, pill }: { label: string; onPress: () => void; loading?: boolean; secondary?: boolean; disabled?: boolean; icon?: IconName; pill?: boolean }) {
  const content = loading ? <ActivityIndicator color={colors.navy} /> : <View style={styles.buttonRow}>{icon ? <Ionicons name={icon} size={18} color={colors.navyDeep} /> : null}<Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{label}</Text></View>;
  const btnRadius = pill ? radius.pill : radius.button;
  return (
    <PressableScale accessibilityRole="button" disabled={disabled || loading} onPress={onPress} style={[styles.button, secondary && styles.buttonSecondary, { borderRadius: btnRadius }]}>
      {secondary ? content : <GlassSurface variant="gold" radius={btnRadius} style={styles.buttonGlass}>{content}</GlassSurface>}
    </PressableScale>
  );
}

export function Field({ label, error, optional, ...props }: TextInputProps & { label: string; error?: string; optional?: boolean }) {
  return <View style={{ gap: 7 }}><Text style={styles.label}>{label}{optional ? <Text style={styles.optional}> (opsional)</Text> : null}</Text><TextInput placeholderTextColor="#8A909A" style={[styles.input, error && { borderColor: colors.danger }]} {...props} />{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

export function Empty({ children }: PropsWithChildren) { return <Card><Text style={styles.empty}>{children}</Text></Card>; }

export function Section({ title, action, children }: PropsWithChildren<{ title: string; action?: ReactNode }>) {
  return <View style={{ gap: 12 }}><View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title.toLocaleUpperCase("id-ID")}</Text>{action}</View>{children}</View>;
}

/** Circular icon holder with a hairline gold ring. */
export function IconRing({ name, size = 44, dark, color }: { name: IconName; size?: number; dark?: boolean; color?: string }) {
  return <View style={[styles.ring, { width: size, height: size }, dark && styles.ringDark]}><Ionicons name={name} size={Math.round(size * 0.45)} color={color ?? (dark ? colors.softGold : colors.goldDark)} /></View>;
}

/** Thin gold line with an eight-point star — a subtle Islamic ornament. */
export function GoldOrnament({ width = 34 }: { width?: number }) {
  return <View accessible={false} style={styles.ornament}><View style={[styles.ornamentLine, { width }]} /><View style={styles.star}><View style={styles.starSquare} /><View style={[styles.starSquare, styles.starRotated]} /></View><View style={[styles.ornamentLine, { width }]} /></View>;
}

/** Standard app bar: circular back button, Cinzel title, optional right action. */
export function AppBar({ title, eyebrow, right, dark, onBack }: { title: string; eyebrow?: string; right?: ReactNode; dark?: boolean; onBack?: () => void }) {
  const back = onBack ?? (() => router.canGoBack() ? router.back() : router.replace("/(tabs)"));
  return <View style={styles.appBar}><CircleButton icon="chevron-back" label="Kembali" onPress={back} dark={dark} /><View style={styles.appBarTitleWrap}>{eyebrow ? <Text style={[styles.appBarEyebrow, dark && { color: colors.gold }]}>{eyebrow}</Text> : null}<Text numberOfLines={1} style={[styles.appBarTitle, dark && { color: colors.white }]}>{title}</Text></View>{right ?? <View style={styles.circle} />}</View>;
}

export function CircleButton({ icon, label, onPress, dark, children }: PropsWithChildren<{ icon: IconName; label: string; onPress: () => void; dark?: boolean }>) {
  const content = (
    <>
      <Ionicons name={icon} size={20} color={dark ? colors.softGold : colors.navy} />
      {children}
    </>
  );

  return (
    <PressableScale accessibilityLabel={label} accessibilityRole="button" hitSlop={4} onPress={onPress} pressedScale={0.92} hoverLift={0}>
      {dark ? (
        <GlassSurface variant="dark" radius={22} style={styles.circle}>
          <View style={styles.circleInner}>{content}</View>
        </GlassSurface>
      ) : (
        <View style={[styles.circle, styles.circleLight]}>{content}</View>
      )}
    </PressableScale>
  );
}

export function Chip({ label, active, onPress, dark }: { label: string; active?: boolean; onPress: () => void; dark?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: Boolean(active) }} onPress={onPress} style={({ pressed }) => [styles.chip, dark && styles.chipDark, active && (dark ? styles.chipActiveDark : styles.chipActive), pressed && { opacity: .75 }]}><Text style={[styles.chipText, dark && styles.chipTextDark, active && styles.chipTextActive]}>{label}</Text></Pressable>;
}

export function GuestGate({ title = "Masuk untuk melanjutkan", body, next }: { title?: string; body: string; next: string }) {
  const loginHref = `/login?next=${encodeURIComponent(next)}`;
  return <Card style={styles.gate}><View style={styles.gateIcon}><Ionicons name="lock-closed-outline" size={26} color={colors.goldDark} /></View><Text style={styles.guestTitle}>{title}</Text><Text style={styles.guestBody}>{body}</Text><View style={styles.gateActions}><Button label="Masuk ke akun jamaah" onPress={() => router.push(loginHref as never)} /><Button secondary label="Nanti saja, lanjut jelajahi" onPress={() => router.replace("/(tabs)")} /></View><Text style={styles.gateNote}>Tanpa akun tetap bisa: Paket · Al-Qur&apos;an · Doa · Jadwal Sholat</Text></Card>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory }, content: { width: "100%", padding: 20, paddingBottom: 40, gap: 20 },
  eyebrow: { color: colors.goldText, fontFamily: "Cinzel_600SemiBold", fontSize: 10.5, letterSpacing: 3 }, eyebrowDark: { color: colors.gold },
  title: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 26, lineHeight: 32 }, subtitle: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 14, lineHeight: 21 },
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: 17, gap: 12, borderWidth: 1, borderColor: colors.goldLine, ...shadow },
  navyCard: { padding: 17, gap: 12 },
  button: { minHeight: 54, borderRadius: radius.button, overflow: "hidden" }, buttonFill: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 18, borderColor: "rgba(255,236,170,0.55)", borderWidth: 1, borderRadius: radius.button },
  buttonGlass: { flex: 1, minHeight: 54, alignItems: "center", justifyContent: "center" },
  buttonSecondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: "rgba(10,29,58,0.22)", alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  buttonRow: { flexDirection: "row", alignItems: "center", gap: 8 }, buttonText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 14.5, letterSpacing: .4 }, buttonTextSecondary: { color: colors.navy, fontFamily: "Montserrat_600SemiBold", letterSpacing: 0 },
  label: { color: colors.ink, fontFamily: "Montserrat_600SemiBold", fontSize: 13 }, optional: { color: colors.muted, fontFamily: "Montserrat_500Medium" },
  input: { minHeight: 52, borderWidth: 1, borderColor: "rgba(10,29,58,0.14)", backgroundColor: colors.white, borderRadius: radius.input, paddingHorizontal: 15, color: colors.ink, fontFamily: "Montserrat_400Regular", fontSize: 15.5 }, error: { color: colors.danger, fontFamily: "Montserrat_400Regular", fontSize: 13 },
  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, sectionTitle: { color: colors.navy, fontFamily: "Cinzel_600SemiBold", fontSize: 12.5, letterSpacing: 2.6 },
  ring: { borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: "rgba(184,134,11,0.35)" }, ringDark: { backgroundColor: "rgba(212,175,55,0.08)", borderColor: "rgba(212,175,55,0.5)" },
  ornament: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, ornamentLine: { height: 1, backgroundColor: "rgba(212,175,55,0.6)" },
  star: { width: 12, height: 12, alignItems: "center", justifyContent: "center" }, starSquare: { position: "absolute", width: 8.5, height: 8.5, borderWidth: 1.2, borderColor: colors.gold }, starRotated: { transform: [{ rotate: "45deg" }] },
  appBar: { minHeight: 64, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  appBarTitleWrap: { flex: 1, alignItems: "center", gap: 2 }, appBarEyebrow: { color: colors.goldText, fontFamily: "Cinzel_600SemiBold", fontSize: 9, letterSpacing: 2.6 }, appBarTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 17, letterSpacing: 1.2 },
  circle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" }, circleInner: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }, circleLight: { backgroundColor: colors.white, borderWidth: 1, borderColor: "rgba(184,134,11,0.32)" }, circleDark: { backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: colors.goldLineDark },
  chip: { minHeight: 38, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1, borderColor: "rgba(10,29,58,0.16)", alignItems: "center", justifyContent: "center" }, chipDark: { borderColor: "rgba(255,255,255,0.18)" },
  chipActive: { backgroundColor: colors.navy, borderColor: colors.navy }, chipActiveDark: { backgroundColor: "rgba(212,175,55,0.14)", borderColor: colors.gold },
  chipText: { color: colors.royal, fontFamily: "Montserrat_500Medium", fontSize: 12.5 }, chipTextDark: { color: "rgba(255,255,255,0.78)" }, chipTextActive: { color: colors.softGold, fontFamily: "Montserrat_600SemiBold" },
  gate: { alignItems: "stretch", padding: 20 }, gateIcon: { alignSelf: "center", width: 62, height: 62, borderRadius: 31, borderWidth: 1, borderColor: "rgba(184,134,11,0.4)", backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  guestTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 20, textAlign: "center" }, guestBody: { color: colors.muted, fontFamily: "Montserrat_400Regular", lineHeight: 21, textAlign: "center" },
  gateActions: { gap: 10, marginTop: 4 }, gateNote: { color: colors.muted, fontFamily: "Montserrat_500Medium", fontSize: 11.5, lineHeight: 17, textAlign: "center" },
  empty: { color: colors.muted, fontFamily: "Montserrat_400Regular", lineHeight: 22, textAlign: "center" },
} as const);
