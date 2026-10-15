export type ItineraryDayStatus = "completed" | "current" | "upcoming";

function calendarDay(value: string) {
  const match = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const stamp = Date.UTC(year, month - 1, day);
  const check = new Date(stamp);
  return check.getUTCFullYear() === year && check.getUTCMonth() === month - 1 && check.getUTCDate() === day ? stamp : null;
}

export function getCurrentItineraryDay(departureDate: string, itineraryLength: number, now = new Date()) {
  const departure = calendarDay(departureDate);
  if (departure === null || itineraryLength < 1) return 0;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const elapsedDays = Math.floor((today - departure) / 86_400_000);
  if (elapsedDays < 0) return 0;
  return Math.min(elapsedDays + 1, itineraryLength + 1);
}
