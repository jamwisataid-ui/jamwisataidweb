export function hasDepartureSeats(availableSeats: number | null | undefined) {
  return availableSeats == null || availableSeats > 0;
}

export function isDepartureSelectable(departure: {
  status: string;
  availableSeats: number | null | undefined;
}) {
  return (departure.status === "open" || departure.status === "limited") && hasDepartureSeats(departure.availableSeats);
}
