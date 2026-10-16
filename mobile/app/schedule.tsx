import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";

import { PackagePreviewSkeleton } from "@/components/home/package-preview-card";
import { ScheduleDepartureCard } from "@/components/schedule/schedule-departure-card";
import { Screen, Title } from "@/components/ui";
import { api } from "@/lib/api";
import { flattenPackageDepartures } from "@/lib/package-departures";
import { colors } from "@/theme";
import type { Package } from "@/types";

export default function ScheduleScreen() {
  const packages = useQuery({ queryKey: ["packages"], queryFn: () => api<Package[]>("/packages") });
  const scheduled = flattenPackageDepartures(packages.data);

  return (
    <Screen>
      <Title subtitle="Jadwal program Umroh yang sedang tersedia.">Jadwal Keberangkatan</Title>
      {packages.isPending ? <PackagePreviewSkeleton /> : null}
      {scheduled.map((item) => <ScheduleDepartureCard key={item.departure.id} item={item} />)}
      {!packages.isPending && scheduled.length === 0 ? <Text style={{ color: colors.muted, textAlign: "center", lineHeight: 22 }}>Jadwal keberangkatan sedang diperbarui.</Text> : null}
    </Screen>
  );
}
