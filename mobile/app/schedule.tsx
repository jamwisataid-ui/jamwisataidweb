import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";

import { PackagePreviewCard, PackagePreviewSkeleton } from "@/components/home/package-preview-card";
import { Screen, Title } from "@/components/ui";
import { api } from "@/lib/api";
import { colors } from "@/theme";
import type { Package } from "@/types";

export default function ScheduleScreen() {
  const packages = useQuery({ queryKey: ["packages"], queryFn: () => api<Package[]>("/packages") });
  const scheduled = packages.data?.filter((item) => item.departureDate) ?? [];

  return (
    <Screen>
      <Title subtitle="Jadwal program Umroh yang sedang tersedia.">Jadwal Keberangkatan</Title>
      {packages.isPending ? <PackagePreviewSkeleton /> : null}
      {scheduled.map((item) => <PackagePreviewCard key={item.id} item={item} />)}
      {!packages.isPending && scheduled.length === 0 ? <Text style={{ color: colors.muted, textAlign: "center", lineHeight: 22 }}>Jadwal keberangkatan sedang diperbarui.</Text> : null}
    </Screen>
  );
}
