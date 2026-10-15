import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors } from "@/theme";

export type PackageFilter = "all" | "regular" | "plus" | "ramadan";

const filters: Array<{ key: PackageFilter; label: string }> = [
  { key: "all", label: "Semua" },
  { key: "regular", label: "Reguler" },
  { key: "plus", label: "Plus" },
  { key: "ramadan", label: "Ramadhan" },
];

export function PackageFilterTabs({ value, onChange }: { value: PackageFilter; onChange: (value: PackageFilter) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {filters.map((filter) => {
        const active = filter.key === value;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={filter.key}
            onPress={() => onChange(filter.key)}
            style={({ pressed }) => [styles.pill, active && styles.activePill, pressed && styles.pressed]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{filter.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 18, paddingVertical: 14, gap: 8 },
  pill: { height: 38, paddingHorizontal: 17, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "#F0ECE3" },
  activePill: { backgroundColor: colors.navy },
  label: { color: colors.navy, fontFamily: "Montserrat_600SemiBold", fontSize: 13 },
  activeLabel: { color: colors.white },
  pressed: { opacity: 0.72 },
});
