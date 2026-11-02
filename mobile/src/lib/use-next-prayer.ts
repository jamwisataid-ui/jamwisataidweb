import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { dateInTimezone, minutesInTimezone, nextPrayer, prayerRows } from "@/lib/prayer-times";
import type { PrayerTimes } from "@/types";

/** Next prayer for a location (default Makkah), with a human "x j y m lagi" countdown. */
export function useNextPrayer(locationId = "makkah", timezone = "Asia/Riyadh") {
  const date = dateInTimezone(timezone);
  const query = useQuery({
    queryKey: ["prayer-times", locationId, date],
    queryFn: () => api<PrayerTimes>(`/prayer-times?location=${locationId}&date=${date}`),
    staleTime: 5 * 60_000,
  });
  if (!query.data) return null;
  const { times, location } = query.data;
  const next = nextPrayer(times, location.timezone);
  const name = prayerRows.find((row) => row.key === next.key)?.name ?? "";
  const [hour, minute] = times[next.key].split(":").map(Number);
  let diff = hour * 60 + minute - minutesInTimezone(location.timezone);
  if (next.tomorrow || diff < 0) diff += 24 * 60;
  const remaining = diff >= 60 ? `${Math.floor(diff / 60)} j ${diff % 60} m lagi` : `${diff} m lagi`;
  return { name, time: times[next.key], city: location.city, remaining };
}
