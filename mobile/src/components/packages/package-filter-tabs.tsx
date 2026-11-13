import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "@/components/ui";

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
        return <Chip key={filter.key} label={filter.label} active={active} onPress={() => onChange(filter.key)} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
});
