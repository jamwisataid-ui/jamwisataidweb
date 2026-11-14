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
  row: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  pill: { height: 38, paddingHorizontal: 17, borderRadius: 19, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(10,29,58,0.16)" },
  activePill: { backgroundColor: colors.navy, borderColor: colors.navy },
  label: { color: colors.royal, fontFamily: "Montserrat_500Medium", fontSize: 12.5 },
  activeLabel: { color: colors.softGold, fontFamily: "Montserrat_600SemiBold" },
  pressed: { opacity: 0.72 },
});
