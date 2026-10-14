import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";
import type { Package } from "@/types";
import type { DetailTab } from "./package-detail-tabs";

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function ListRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return <View style={styles.row}><View style={styles.icon}><Ionicons name={icon} size={16} color={colors.navy} /></View><Text style={styles.rowText}>{text}</Text></View>;
}

function benefitValues(item: Package) {
  if (item.highlights?.length) return item.highlights;
  return [
    item.makkahHotel ? `Hotel Makkah ${item.makkahHotel.name}${item.makkahHotel.star ? ` (${item.makkahHotel.star} bintang)` : ""}` : undefined,
    item.madinahHotel ? `Hotel Madinah ${item.madinahHotel.name}${item.madinahHotel.star ? ` (${item.madinahHotel.star} bintang)` : ""}` : undefined,
    item.airline ? `Penerbangan bersama ${item.airline}` : undefined,
    ...(item.plusHotels ?? []).map((hotel) => `Hotel ${hotel.destination}: ${hotel.name}`),
  ].filter((value): value is string => Boolean(value));
}

function DetailContent({ item }: { item: Package }) {
  const benefits = benefitValues(item);
  return <View style={styles.section}><SectionTitle>Keunggulan Program</SectionTitle><View style={styles.list}>{benefits.length ? benefits.map((value, index) => <ListRow key={`${value}-${index}`} icon={index < 2 ? "business-outline" : index === 2 ? "airplane-outline" : "checkmark-circle-outline"} text={value} />) : <Text style={styles.empty}>Informasi keunggulan sedang dilengkapi.</Text>}</View></View>;
}

function ItineraryContent({ item }: { item: Package }) {
  return <View style={styles.section}><SectionTitle>Rencana Perjalanan</SectionTitle>{item.itinerary?.length ? <View style={styles.timeline}>{item.itinerary.map((day, index) => <View key={`${day.day}-${day.title}`} style={styles.timelineRow}><View style={styles.timelineRail}><View style={styles.dayCircle}><Text style={styles.dayNumber}>{day.day}</Text></View>{index < item.itinerary!.length - 1 ? <View style={styles.rail} /> : null}</View><View style={styles.dayCopy}><Text style={styles.dayLabel}>HARI {day.day}</Text><Text style={styles.dayTitle}>{day.title}</Text><Text style={styles.dayDescription}>{day.description}</Text></View></View>)}</View> : <Text style={styles.empty}>Itinerary lengkap sedang disiapkan.</Text>}</View>;
}

function FacilityContent({ item }: { item: Package }) {
  const facilities = item.facilities?.length ? item.facilities : item.includes ?? [];
  return <View style={styles.section}><SectionTitle>Fasilitas Termasuk</SectionTitle><View style={styles.grid}>{facilities.length ? facilities.map((value, index) => <View key={`${value}-${index}`} style={styles.gridItem}><Ionicons name="checkmark-circle" size={19} color={colors.gold} /><Text style={styles.gridText}>{value}</Text></View>) : <Text style={styles.empty}>Informasi fasilitas sedang dilengkapi.</Text>}</View>{item.excludes?.length ? <><Text style={styles.subheading}>Belum termasuk</Text><View style={styles.list}>{item.excludes.map((value, index) => <ListRow key={`${value}-${index}`} icon="remove-circle-outline" text={value} />)}</View></> : null}</View>;
}

function RequirementContent({ item }: { item: Package }) {
  return <View style={styles.section}><SectionTitle>Syarat & Ketentuan</SectionTitle><View style={styles.requirementCard}>{item.terms?.length ? item.terms.map((value, index) => <ListRow key={`${value}-${index}`} icon="document-text-outline" text={value} />) : <Text style={styles.empty}>Syarat pendaftaran akan dikonfirmasi oleh tim JAM WISATA.</Text>}</View></View>;
}

export function PackageDetailContent({ item, tab }: { item: Package; tab: DetailTab }) {
  if (tab === "itinerary") return <ItineraryContent item={item} />;
  if (tab === "facilities") return <FacilityContent item={item} />;
  if (tab === "requirements") return <RequirementContent item={item} />;
  return <DetailContent item={item} />;
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 18, paddingTop: 21, paddingBottom: 8, gap: 15 },
  sectionTitle: { color: colors.navy, fontFamily: "PlayfairDisplay_700Bold", fontSize: 20, lineHeight: 25 },
  subheading: { marginTop: 8, color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 15 },
  list: { gap: 11 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 11 },
  icon: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF0D5" },
  rowText: { flex: 1, paddingTop: 4, color: colors.ink, fontFamily: "DMSans_400Regular", fontSize: 14, lineHeight: 21 },
  empty: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 14, lineHeight: 22 },
  timeline: { gap: 0 },
  timelineRow: { flexDirection: "row", gap: 13 },
  timelineRail: { width: 34, alignItems: "center" },
  dayCircle: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: "#F6D98A" },
  dayNumber: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 13 },
  rail: { width: 2, flex: 1, minHeight: 54, backgroundColor: "#E5D9BD" },
  dayCopy: { flex: 1, paddingBottom: 19, gap: 3 },
  dayLabel: { color: colors.gold, fontFamily: "DMSans_700Bold", fontSize: 10, letterSpacing: 1 },
  dayTitle: { color: colors.navy, fontFamily: "DMSans_700Bold", fontSize: 15, lineHeight: 20 },
  dayDescription: { color: colors.muted, fontFamily: "DMSans_400Regular", fontSize: 13, lineHeight: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "48%", minHeight: 64, padding: 11, borderRadius: 14, flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  gridText: { flex: 1, color: colors.ink, fontFamily: "DMSans_400Regular", fontSize: 12.5, lineHeight: 18 },
  requirementCard: { padding: 16, gap: 13, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
});
