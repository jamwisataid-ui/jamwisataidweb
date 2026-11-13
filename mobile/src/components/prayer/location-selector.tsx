import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { prayerLocations, type PrayerLocation } from "@/lib/prayer-times";
import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";

export function LocationSelector({ value, open, onOpen, onClose, onChange }: { value: PrayerLocation; open: boolean; onOpen: () => void; onClose: () => void; onChange: (location: PrayerLocation) => void }) {
  return <><Pressable accessibilityLabel="Pilih lokasi jadwal sholat" accessibilityRole="button" onPress={onOpen} style={({ pressed }) => pressed && styles.pressed}><GlassSurface variant="pearl" radius={25} glow={false} style={styles.selector}><GlassSurface variant="navyOrb" radius={14} style={styles.pin}><Ionicons name="location" size={18} color={colors.softGold} /></GlassSurface><Text style={styles.selected}>{value.city}, {value.country}</Text><Ionicons name="chevron-down" size={19} color={colors.muted} /></GlassSurface></Pressable><Modal animationType="slide" onRequestClose={onClose} transparent visible={open}><Pressable onPress={onClose} style={styles.backdrop}><Pressable onPress={(event) => event.stopPropagation()}><GlassSurface variant="pearl" radius={25} style={styles.sheet}><View style={styles.handle} /><View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>Pilih Lokasi</Text><Text style={styles.sheetBody}>Waktu mengikuti zona kota yang dipilih.</Text></View><Pressable accessibilityLabel="Tutup" onPress={onClose}><GlassSurface variant="pearl" radius={21} style={styles.close}><Ionicons name="close" size={22} color={colors.navy} /></GlassSurface></Pressable></View><ScrollView contentContainerStyle={styles.options}>{prayerLocations.map((location) => { const active = location.id === value.id; return <Pressable key={location.id} onPress={() => { onChange(location); onClose(); }} style={[styles.option, active && styles.optionActive]}><GlassSurface variant={active ? "navyOrb" : "pearl"} radius={19} glow={false} style={styles.optionIcon}><Ionicons name="location-outline" size={19} color={active ? colors.softGold : colors.navy} /></GlassSurface><View style={styles.optionCopy}><Text style={styles.optionCity}>{location.city}</Text><Text style={styles.optionCountry}>{location.country}</Text></View>{active ? <Ionicons name="checkmark-circle" size={22} color={colors.goldText} /> : null}</Pressable>; })}</ScrollView></GlassSurface></Pressable></Pressable></Modal></>;
}

const styles = StyleSheet.create({
  selector: { marginHorizontal: 18, minHeight: 50, paddingHorizontal: 13, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 10 },
  pressed: { opacity: .75 }, pin: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  selected: { flex: 1, color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 14 },
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(2,23,48,.34)" },
  sheet: { maxHeight: "78%", paddingTop: 10, paddingBottom: 26, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  handle: { width: 42, height: 4, marginBottom: 13, borderRadius: 2, alignSelf: "center", backgroundColor: "#CCC5B9" },
  sheetHeader: { paddingHorizontal: 20, paddingBottom: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sheetTitle: { color: colors.navy, fontFamily: "Cinzel_700Bold", fontSize: 22 }, sheetBody: { marginTop: 3, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 12.5 },
  close: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  options: { paddingHorizontal: 18, gap: 8 }, option: { minHeight: 62, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  optionActive: { borderColor: colors.gold, backgroundColor: "rgba(212,175,55,0.08)" }, optionIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  optionCopy: { flex: 1 }, optionCity: { color: colors.navy, fontFamily: "Montserrat_700Bold", fontSize: 14 }, optionCountry: { marginTop: 2, color: colors.muted, fontFamily: "Montserrat_400Regular", fontSize: 11.5 },
});
