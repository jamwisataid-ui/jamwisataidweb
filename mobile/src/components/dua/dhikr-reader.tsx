import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MetallicGold } from "@/components/metallic-gold";
import { FadeInView, PopOnChange, PressableScale } from "@/components/motion";
import { AppBar, GoldOrnament, NavyCard } from "@/components/ui";
import type { DuaCollection, DuaItem } from "@/lib/dua-dhikr";
import { dhikrFontSizes, dhikrModes, repeatCount, type DhikrMode } from "@/lib/dhikr-reader";
import { qpcHafsText } from "@/lib/qpc-hafs-text";
import { colors, typography } from "@/theme";
import { GlassSurface } from "@/components/glass";

/** Eight-point star with the item number inside — the reader's verse marker. */
function StarNumber({ value, done }: { value: number; done: boolean }) {
  return (
    <View style={styles.starWrap}>
      <View style={[styles.starSquare, done && styles.starDone]} />
      <View style={[styles.starSquare, styles.starRotated, done && styles.starDone]} />
      <Text style={[styles.starText, done && styles.starTextDone]}>{value}</Text>
    </View>
  );
}

function Counter({ count, target, onPress }: { count: number; target: number; onPress: () => void }) {
  const done = count >= target;
  const label = done ? "Selesai" : target === 1 ? "Tandai dibaca" : `${count}/${target}`;
  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={done ? "Bacaan selesai, ketuk untuk ulang" : `Hitung bacaan, ${count} dari ${target}`} onPress={onPress} style={styles.counterPress}>
      <PopOnChange trigger={count}>
        {done ? (
          <MetallicGold style={styles.counterDone}><Ionicons name="checkmark" size={14} color={colors.navyDeep} /><Text style={styles.counterDoneText}>{label}</Text></MetallicGold>
        ) : (
          <View style={styles.counter}><Ionicons name={target === 1 ? "ellipse-outline" : "finger-print-outline"} size={14} color={colors.goldDark} /><Text style={styles.counterText}>{label}</Text></View>
        )}
      </PopOnChange>
    </PressableScale>
  );
}

function ReaderItem({ item, index, mode, fontSize, count, onCount }: { item: DuaItem; index: number; mode: DhikrMode; fontSize: number; count: number; onCount: () => void }) {
  const target = repeatCount(item.notes);
  const done = count >= target;
  return (
    <View style={styles.item}>
      <View style={styles.itemHead}>
        <StarNumber value={index + 1} done={done} />
        <View style={styles.itemHeadCopy}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {target > 1 ? <Text style={styles.itemRepeat}>Dibaca {target}x</Text> : null}
        </View>
      </View>
      <Text selectable style={[styles.arabic, { fontSize, lineHeight: Math.round(fontSize * 2) }]}>
        {qpcHafsText(item.arabic)}{target > 1 ? <Text style={[styles.arabicRepeat, { fontSize: Math.round(fontSize * 0.55) }]}>{`  (${target}×)`}</Text> : null}
      </Text>
      {mode !== "arabic" && item.latin ? <Text selectable style={styles.latin}>{item.latin}</Text> : null}
      {mode === "full" ? <Text selectable style={styles.translation}>{item.translation}</Text> : null}
      {mode === "full" && item.notes && target === 1 && /atau|setelah/i.test(item.notes) ? <Text style={styles.note}>{item.notes}</Text> : null}
      <View style={styles.itemFoot}><Counter count={count} target={target} onPress={onCount} /></View>
    </View>
  );
}

/**
 * Continuous reader for dhikr collections (pagi, petang, setelah sholat):
 * all recitations flow on one sheet in order — like Al-Ma'tsurat — instead of a list of separate pages.
 */
export function DhikrReader({ collection }: { collection: DuaCollection }) {
  const [mode, setMode] = useState<DhikrMode>("arabic");
  const [sizeIndex, setSizeIndex] = useState(1);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const fontSize = dhikrFontSizes[sizeIndex];
  const completed = useMemo(() => collection.items.filter((item) => (counts[item.id] ?? 0) >= repeatCount(item.notes)).length, [collection.items, counts]);
  const total = collection.items.length;
  const allDone = completed === total;

  const tick = (item: DuaItem) => setCounts((current) => {
    const target = repeatCount(item.notes);
    const value = current[item.id] ?? 0;
    return { ...current, [item.id]: value >= target ? 0 : value + 1 };
  });

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <AppBar title={collection.title} eyebrow="BACAAN BERSAMBUNG" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <FadeInView>
          <NavyCard style={styles.hero}>
            <Text style={styles.heroEyebrow}>{collection.subtitle.toLocaleUpperCase("id-ID")}</Text>
            <Text style={styles.heroTitle}>{total} bacaan, dibaca berurutan</Text>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${(completed / total) * 100}%` }]}><MetallicGold style={StyleSheet.absoluteFill} /></View></View>
            <Text style={styles.heroMeta}>{completed} dari {total} selesai · ketuk penanda di bawah tiap bacaan untuk menghitung</Text>
          </NavyCard>
        </FadeInView>

        <FadeInView delay={80} style={styles.toolbar}>
          <View role="tablist" style={styles.modes}>
            {dhikrModes.map((option) => {
              const active = option.key === mode;
              return <Pressable key={option.key} role="tab" accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={() => setMode(option.key)} style={styles.mode}><GlassSurface variant={active ? "gold" : "pearl"} radius={10} glow={active} style={styles.modeSurface}><Text style={[styles.modeText, active && styles.modeTextActive]}>{option.label}</Text></GlassSurface></Pressable>;
            })}
          </View>
          <View style={styles.sizes}>
            <Pressable accessibilityRole="button" accessibilityLabel="Perkecil teks Arab" disabled={sizeIndex === 0} onPress={() => setSizeIndex((value) => Math.max(0, value - 1))} style={sizeIndex === 0 && styles.sizeDisabled}><GlassSurface variant="pearl" radius={22} glow={false} style={styles.sizeButton}><Text style={styles.sizeSmall}>A</Text></GlassSurface></Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Perbesar teks Arab" disabled={sizeIndex === dhikrFontSizes.length - 1} onPress={() => setSizeIndex((value) => Math.min(dhikrFontSizes.length - 1, value + 1))} style={sizeIndex === dhikrFontSizes.length - 1 && styles.sizeDisabled}><GlassSurface variant="pearl" radius={22} glow={false} style={styles.sizeButton}><Text style={styles.sizeLarge}>A</Text></GlassSurface></Pressable>
          </View>
        </FadeInView>

        <FadeInView delay={160} style={styles.sheet}>
          <View style={styles.sheetHead}>
            <Text style={styles.sheetTitle}>{collection.title.toLocaleUpperCase("id-ID")}</Text>
            <GoldOrnament width={44} />
          </View>
          {collection.items.map((item, index) => (
            <View key={item.id}>
              {index > 0 ? <View style={styles.divider}><GoldOrnament width={56} /></View> : null}
              <ReaderItem item={item} index={index} mode={mode} fontSize={fontSize} count={counts[item.id] ?? 0} onCount={() => tick(item)} />
            </View>
          ))}
        </FadeInView>

        <View style={styles.finish}>
          {allDone ? <Text style={styles.finishTitle}>Alhamdulillah, dzikir selesai</Text> : <Text style={styles.finishHint}>Sisa {total - completed} bacaan</Text>}
          {completed > 0 ? <Pressable accessibilityRole="button" onPress={() => setCounts({})} hitSlop={8}><Text style={styles.reset}>Ulangi dari awal</Text></Pressable> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  content: { paddingHorizontal: 18, paddingBottom: 40, gap: 14 },
  hero: { padding: 18, gap: 8 },
  heroEyebrow: { color: colors.gold, fontFamily: "Cinzel_600SemiBold", fontSize: 9.5, letterSpacing: 2.4 },
  heroTitle: { color: colors.white, fontFamily: "Cinzel_600SemiBold", fontSize: 17, lineHeight: 22 },
  progressTrack: { height: 6, marginTop: 4, borderRadius: 999, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.12)" },
  progressFill: { height: 6, borderRadius: 999, overflow: "hidden" },
  heroMeta: { color: "rgba(255,255,255,0.72)", fontFamily: "Montserrat_400Regular", fontSize: 11.5, lineHeight: 16 },
  toolbar: { flexDirection: "row", alignItems: "center", gap: 10 },
  modes: { flex: 1, flexDirection: "row", gap: 4 },
  mode: { flex: 1, height: 36, borderRadius: 10 }, modeSurface: { height: 36, alignItems: "center", justifyContent: "center" },
  modeText: { color: colors.muted, fontFamily: "Montserrat_500Medium", fontSize: 12 },
  modeTextActive: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold" },
  sizes: { flexDirection: "row", gap: 6 },
  sizeButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  sizeDisabled: { opacity: 0.4 },
  sizeSmall: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 13 },
  sizeLarge: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 19 },
  sheet: { paddingHorizontal: 18, paddingVertical: 22, borderRadius: 24, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.goldLine },
  sheetHead: { alignItems: "center", gap: 6, marginBottom: 14 },
  sheetTitle: { color: colors.navy, fontFamily: "Cinzel_600SemiBold", fontSize: 13, letterSpacing: 3 },
  divider: { paddingVertical: 18 },
  item: { gap: 10 },
  itemHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemHeadCopy: { flex: 1, gap: 1 },
  itemTitle: { color: colors.navy, fontFamily: "Montserrat_600SemiBold", fontSize: 12.5 },
  itemRepeat: { color: colors.goldText, fontFamily: "Montserrat_500Medium", fontSize: 11 },
  starWrap: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  starSquare: { position: "absolute", width: 21, height: 21, borderWidth: 1, borderColor: colors.gold },
  starRotated: { transform: [{ rotate: "45deg" }] },
  starDone: { backgroundColor: "rgba(212,175,55,0.18)" },
  starText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 10.5 },
  starTextDone: { color: colors.goldText },
  arabic: { color: colors.navy, fontFamily: typography.quranArabic, textAlign: "right", writingDirection: "rtl" },
  arabicRepeat: { color: colors.goldText, fontFamily: "Montserrat_700Bold" },
  latin: { color: colors.ink, fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 16, lineHeight: 23 },
  translation: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 13, lineHeight: 20 },
  note: { color: colors.goldText, fontFamily: "Montserrat_500Medium", fontSize: 11.5 },
  itemFoot: { flexDirection: "row", justifyContent: "flex-end" },
  counterPress: { borderRadius: 999 },
  counter: { minHeight: 36, paddingHorizontal: 14, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: "rgba(184,134,11,0.4)", backgroundColor: "rgba(212,175,55,0.06)" },
  counterText: { color: colors.goldText, fontFamily: "Montserrat_600SemiBold", fontSize: 12 },
  counterDone: { minHeight: 36, paddingHorizontal: 14, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 6 },
  counterDoneText: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold", fontSize: 12 },
  finish: { alignItems: "center", gap: 8, paddingVertical: 6 },
  finishTitle: { color: colors.goldText, fontFamily: "CormorantGaramond_600SemiBold_Italic", fontSize: 20 },
  finishHint: { color: colors.muted, fontFamily: "Montserrat_500Medium", fontSize: 12 },
  reset: { color: colors.navy, fontFamily: "Montserrat_600SemiBold", fontSize: 12.5, textDecorationLine: "underline" },
});
