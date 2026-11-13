import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";
import { GlassSurface } from "@/components/glass";

export type DetailTab = "detail" | "itinerary" | "facilities" | "requirements";

const tabs: Array<{ key: DetailTab; label: string }> = [
  { key: "detail", label: "Detail" },
  { key: "itinerary", label: "Itinerary" },
  { key: "facilities", label: "Fasilitas" },
  { key: "requirements", label: "Syarat" },
];

export function PackageDetailTabs({ value, onChange }: { value: DetailTab; onChange: (tab: DetailTab) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
      {tabs.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} key={tab.key} onPress={() => onChange(tab.key)} style={styles.tab}>
            <GlassSurface variant={active ? "gold" : "pearl"} radius={18} glow={active} style={styles.surface}><Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text></GlassSurface>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabs: { minWidth: "100%", paddingHorizontal: 18, paddingVertical: 12, gap: 8 },
  tab: { minWidth: 88, flex: 1 }, surface: { minHeight: 40, paddingHorizontal: 14, alignItems: "center", justifyContent: "center" },
  label: { color: colors.muted, fontFamily: "Montserrat_500Medium", fontSize: 13.5 },
  activeLabel: { color: colors.navyDeep, fontFamily: "Montserrat_700Bold" },
});
