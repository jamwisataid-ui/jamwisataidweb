export type RegistrationSeatStatus = "pending" | "active" | "cancelled" | "completed";

export function countSeatConsumingRegistrations(statuses: readonly RegistrationSeatStatus[]) {
  return statuses.filter((status) => status !== "cancelled").length;
}

export function calculateRemainingSeats(capacity: number | null | undefined, activeRegistrations: number) {
  if (capacity == null) return null;
  return Math.max(0, capacity - Math.max(0, activeRegistrations));
}

export function hasDepartureSeats(remainingSeats: number | null | undefined) {
  return remainingSeats == null || remainingSeats > 0;
}

export function isDepartureSelectable(departure: {
  status: string;
  remainingSeats: number | null | undefined;
}) {
  if (departure.status === "closed" || departure.status === "coming-soon") return false;
  return hasDepartureSeats(departure.remainingSeats);
}
