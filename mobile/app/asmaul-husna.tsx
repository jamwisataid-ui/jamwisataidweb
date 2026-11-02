import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FadeInView, PressableScale } from "@/components/motion";
import { AppBar, GoldOrnament, NavyCard } from "@/components/ui";
import { asmaulHusna, searchAsmaulHusna, type AsmaulHusna } from "@/data/asmaul-husna";
import { qpcHafsText } from "@/lib/qpc-hafs-text";
import { colors, shadow, typography } from "@/theme";

function NumberStar({ value, size = 34, light }: { value: number; size?: number; light?: boolean }) {
  const square = Math.round(size * 0.68);
  return (
    <View style={[styles.star, { width: size, height: size }]}>
      <View style={[styles.starSquare, { width: square, height: square }, light && styles.starLight]} />
      <View style={[styles.starSquare, styles.starRotated, { width: square, height: square }, light && styles.starLight]} />
      <Text style={[styles.starText, light && { color: colors.softGold }]}>{value}</Text>
    </View>
  );
}

function NameCard({ item, index, onPress }: { item: AsmaulHusna; index: number; onPress: () => void }) {
  return (
    <FadeInView delay={Math.min(index, 10) * 45} style={styles.cell}>
      <PressableScale accessibilityRole="button" accessibilityLabel={`${item.number}. ${item.latin}, ${item.meaning}`} onPress={onPress} style={styles.card}>
        <View style={styles.cardTop}><NumberStar value={item.number} /></View>
        <Text style={styles.arabic}>{qpcHafsText(item.arabic)}</Text>
        <Text numberOfLines={1} style={styles.latin}>{item.latin}</Text>
        <Text numberOfLines={2} style={styles.meaning}>{item.meaning}</Text>
      </PressableScale>
    </FadeInView>
  );
}

function NameDetail({ item, onClose, onStep }: { item: AsmaulHusna | null; onClose: () => void; onStep: (direction: -1 | 1) => void }) {
  return (
    <Modal transparent animationType="fade" visible={Boolean(item)} onRequestClose={onClose}>
      <Pressable accessibilityLabel="Tutup" onPress={onClose} style={styles.backdrop}>
        {item ? (
          <Pressable onPress={(event) => event.stopPropagation()} style={styles.dialogWrap}>
            <FadeInView key={item.number} distance={10} duration={320}>
              <NavyCard style={styles.dialog}>
                <NumberStar value={item.number} size={46} light />
                <Text style={styles.dialogArabic}>{qpcHafsText(item.arabic)}</Text>
                <GoldOrnament width={40} />
                <Text style={styles.dialogLatin}>{item.latin}</Text>
                <Text style={styles.dialogMeaning}>{item.meaning}</Text>
                <View style={styles.dialogNav}>
                  <Pressable accessibilityRole="button" accessibilityLabel="Nama sebelumnya" disabled={item.number === 1} onPress={() => onStep(-1)} style={[styles.navButton, item.number === 1 && styles.navDisabled]}><Ionicons name="chevron-back" size={20} color={colors.softGold} /></Pressable>
                  <Text style={styles.navCount}>{item.number} / 99</Text>
                  <Pressable accessibilityRole="button" accessibilityLabel="Nama berikutnya" disabled={item.number === 99} onPress={() => onStep(1)} style={[styles.navButton, item.number === 99 && styles.navDisabled]}><Ionicons name="chevron-forward" size={20} color={colors.softGold} /></Pressable>
                </View>
              </NavyCard>
            </FadeInView>
          </Pressable>
        ) : null}
      </Pressable>
    </Modal>
  );
}

export default function AsmaulHusnaScreen() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const items = useMemo(() => searchAsmaulHusna(query), [query]);
  const current = selected ? asmaulHusna[selected - 1] : null;

  const header = (
    <View style={styles.header}>
      <FadeInView>
        <NavyCard style={styles.hero}>
          <Text style={styles.heroArabic}>{qpcHafsText("وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا")}</Text>
          <GoldOrnament width={36} />
          <Text style={styles.heroQuote}>“Hanya milik Allah asmaul husna, maka bermohonlah kepada-Nya dengan menyebutnya.”</Text>
          <Text style={styles.heroSource}>QS. Al-A&apos;raf: 180</Text>
        </NavyCard>
      </FadeInView>
      <View style={styles.search}>
        <Ionicons name="search-outline" size={18} color={colors.goldDark} />
        <TextInput accessibilityLabel="Cari Asmaul Husna" value={query} onChangeText={setQuery} placeholder="Cari nama, arti, atau nomor…" placeholderTextColor="#8A909A" style={styles.searchInput} />
        {query ? <Pressable accessibilityLabel="Hapus pencarian" onPress={() => setQuery("")} hitSlop={8}><Ionicons name="close-circle" size={18} color={colors.muted} /></Pressable> : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <AppBar title="Asmaul Husna" eyebrow="99 NAMA ALLAH" />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.number)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={header}
        ListEmptyComponent={<Text style={styles.empty}>Tidak ada nama yang cocok dengan “{query}”.</Text>}
        renderItem={({ item, index }) => <NameCard item={item} index={index} onPress={() => setSelected(item.number)} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
      />
      <NameDetail item={current} onClose={() => setSelected(null)} onStep={(direction) => setSelected((value) => value ? Math.min(99, Math.max(1, value + direction)) : value)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center", backgroundColor: colors.ivory },
  list: { paddingHorizontal: 18, paddingBottom: 36 },
  header: { gap: 14, marginBottom: 14 },
  hero: { padding: 18, alignItems: "center", gap: 8 },
  heroArabic: { color: colors.softGold, fontFamily: typography.quranArabic, fontSize: 26, lineHeight: 52, textAlign: "center", writingDirection: "rtl" },
  heroQuote: { color: "rgba(255,255,255,0.88)", fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 16, lineHeight: 21, textAlign: "center" },
  heroSource: { color: "rgba(255,255,255,0.6)", fontFamily: "Montserrat_500Medium", fontSize: 10.5 },
  search: { height: 48, paddingHorizontal: 16, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: "rgba(10,29,58,0.14)" },
  searchInput: { flex: 1, height: 46, color: colors.ink, fontFamily: "Montserrat_400Regular", fontSize: 14 },
  row: { gap: 12, marginBottom: 12 },
  cell: { flex: 1 },
  card: { minHeight: 176, padding: 14, borderRadius: 20, alignItems: "center", gap: 4, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.goldLine, ...shadow },
  cardTop: { alignSelf: "flex-start" },
  arabic: { color: colors.navy, fontFamily: typography.quranArabic, fontSize: 28, lineHeight: 52, textAlign: "center", writingDirection: "rtl" },
  latin: { color: colors.navy, fontFamily: "Cinzel_600SemiBold", fontSize: 13, letterSpacing: 0.4, textAlign: "center" },
  meaning: { color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5, lineHeight: 16, textAlign: "center" },
  star: { alignItems: "center", justifyContent: "center" },
  starSquare: { position: "absolute", borderWidth: 1, borderColor: colors.gold },
  starRotated: { transform: [{ rotate: "45deg" }] },
  starLight: { borderColor: "rgba(212,175,55,0.7)" },
  starText: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 10.5 },
  empty: { paddingVertical: 30, color: colors.muted, fontFamily: "Montserrat_400Regular", textAlign: "center" },
  backdrop: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "rgba(6,21,43,0.6)" },
  dialogWrap: { width: "100%", maxWidth: 400, alignSelf: "center" },
  dialog: { paddingVertical: 26, paddingHorizontal: 22, alignItems: "center", gap: 10 },
  dialogArabic: { color: colors.white, fontFamily: typography.quranArabic, fontSize: 46, lineHeight: 92, textAlign: "center", writingDirection: "rtl" },
  dialogLatin: { color: colors.softGold, fontFamily: "Cinzel_700Bold", fontSize: 21, letterSpacing: 1, textAlign: "center" },
  dialogMeaning: { color: "rgba(255,255,255,0.86)", fontFamily: "CormorantGaramond_500Medium_Italic", fontSize: 19, lineHeight: 24, textAlign: "center" },
  dialogNav: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 18 },
  navButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(212,175,55,0.45)" },
  navDisabled: { opacity: 0.35 },
  navCount: { color: "rgba(255,255,255,0.72)", fontFamily: "Montserrat_600SemiBold", fontSize: 12 },
});
