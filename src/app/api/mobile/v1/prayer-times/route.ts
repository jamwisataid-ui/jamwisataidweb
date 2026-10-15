import { mobileData, mobileError, MobileApiError } from "@/lib/mobile/api";
import { dateInTimezone, prayerLocations, type PrayerLocationId } from "@/lib/mobile/prayer-times";

type AladhanResponse = {
  code: number;
  data?: {
    timings: Record<string, string>;
    date: { hijri: { day: string; month: { number: number; en: string }; year: string } };
  };
};

function cleanTime(value?: string) {
  const match = value?.match(/^\d{2}:\d{2}/);
  if (!match) throw new MobileApiError(502, "PRAYER_TIMES_UNAVAILABLE", "Jadwal sholat belum dapat dimuat.");
  return match[0];
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const locationId = (url.searchParams.get("location") || "makkah") as PrayerLocationId;
    const location = prayerLocations[locationId];
    if (!location) throw new MobileApiError(400, "INVALID_LOCATION", "Lokasi jadwal sholat tidak tersedia.");
    const isoDate = url.searchParams.get("date") || dateInTimezone(location.timezone);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) throw new MobileApiError(400, "INVALID_DATE", "Tanggal jadwal sholat tidak valid.");
    const [year, month, day] = isoDate.split("-");
    const upstreamUrl = new URL(`https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}`);
    upstreamUrl.searchParams.set("city", location.city);
    upstreamUrl.searchParams.set("country", location.apiCountry);
    upstreamUrl.searchParams.set("method", String(location.method));
    upstreamUrl.searchParams.set("school", "0");
    upstreamUrl.searchParams.set("timezonestring", location.timezone);
    upstreamUrl.searchParams.set("calendarMethod", "UAQ");
    const response = await fetch(upstreamUrl, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8_000) });
    if (!response.ok) throw new MobileApiError(502, "PRAYER_TIMES_UNAVAILABLE", "Jadwal sholat belum dapat dimuat.");
    const payload = await response.json() as AladhanResponse;
    if (payload.code !== 200 || !payload.data) throw new MobileApiError(502, "PRAYER_TIMES_UNAVAILABLE", "Jadwal sholat belum dapat dimuat.");
    const { timings, date } = payload.data;
    return mobileData({
      location: { id: location.id, city: location.city, country: location.country, timezone: location.timezone, latitude: location.latitude, longitude: location.longitude },
      date: { iso: isoDate, hijri: { day: date.hijri.day, month: date.hijri.month.number, monthName: date.hijri.month.en, year: date.hijri.year } },
      times: { fajr: cleanTime(timings.Fajr), sunrise: cleanTime(timings.Sunrise), dhuhr: cleanTime(timings.Dhuhr), asr: cleanTime(timings.Asr), maghrib: cleanTime(timings.Maghrib), isha: cleanTime(timings.Isha) },
      calculation: location.method === 20 ? "Kementerian Agama Republik Indonesia" : location.method === 4 ? "Umm Al-Qura University, Makkah" : "Metode resmi wilayah",
      updatedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" } });
  } catch (error) {
    return mobileError(error, "prayer-times");
  }
}
