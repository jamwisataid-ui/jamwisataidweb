import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme";

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
            <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
            <View style={[styles.line, active && styles.activeLine]} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabs: { minWidth: "100%", paddingHorizontal: 18, borderBottomWidth: 1, borderBottomColor: "#EDE7DC" },
  tab: { minWidth: 88, flex: 1, paddingTop: 18, alignItems: "center" },
  label: { paddingBottom: 11, color: colors.muted, fontFamily: "DMSans_500Medium", fontSize: 13.5 },
  activeLabel: { color: colors.navy, fontFamily: "DMSans_700Bold" },
  line: { width: "100%", height: 3, borderRadius: 3, backgroundColor: "transparent" },
  activeLine: { backgroundColor: colors.navy },
});
