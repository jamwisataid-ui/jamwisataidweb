export type PackageDeparture = { id: string; departureDate: string; dateLabel: string; returnDate?: string; price?: number; quota?: number; remainingQuota?: number; status: "available" | "limited" | "sold-out" | "coming-soon"; selectable: boolean };
export type Package = { id: string; slug: string; name: string; category: string; packageType: string; badge?: string; image: string; durationDays?: number; departureDate?: string; departureId?: string; departures?: PackageDeparture[]; destination?: string[]; priceFrom?: number; status: string; airline?: string; departureAirport?: string; makkahHotel?: { name: string; star?: number }; madinahHotel?: { name: string; star?: number }; plusHotels?: Array<{ destination: string; name: string; star?: number }>; facilities?: string[]; itinerary?: Array<{ day: number; title: string; description: string }>; includes?: string[]; excludes?: string[]; highlights?: string[]; terms?: string[] };

export type LiveMuthowifSession = {
  id: string;
  title: string;
  type: "thawaf" | "sai" | "kajian" | "ziarah" | "briefing" | "other";
  status: "scheduled" | "live" | "ended";
  muthowif: { name: string; avatar?: string | null };
  rombonganName: string;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  image?: string | null;
  listenerCount: number;
  capacity: number;
  canJoin: boolean;
};

export type LiveJoinCredentials = {
  token: string;
  serverUrl: string;
  roomName: string;
  session: { id: string; title: string; muthowifName: string };
};
export type MuthowifSession = {
  id: string;
  title: string;
  type: "thawaf" | "sai" | "kajian" | "ziarah" | "briefing" | "other";
  status: "scheduled" | "live" | "ended";
  roomName: string;
  startsAt: string;
  liveStartedAt?: string | null;
  liveEndedAt?: string | null;
  location?: string | null;
  listenerCount: number;
  capacity: number;
  rombongan: { id: string; name: string; totalJamaah: number };
  muthowifName: string;
};
export type MuthowifBroadcastCredentials = { token: string; serverUrl: string; roomName: string };
export type Journey = { registrationId: string; bookingNumber: string; status: string; source: string; package: { id: string; slug: string; name: string; image: string; durationDays?: number }; departure: { id: string; departureDate: string; returnDate?: string | null; dateLabel: string; airline: string; departureAirport: string; status: string; price: string }; itinerary: Array<{ id: string; day: number; title: string; description: string }>; hotels: Array<{ id: string; city: string; hotelName: string; star?: number | null }>; rooms: { makkah?: string | null; madinah?: string | null; type?: string | null } };
export type Document = { id: string; kind: string; originalName: string; mimeType: string; sizeBytes: number; reviewStatus: string; reviewNote?: string | null; createdAt: string };
export type PrayerTimes = { location: { id: string; city: string; country: string; timezone: string; latitude: number; longitude: number }; date: { iso: string; hijri: { day: string; month: number; monthName: string; year: string } }; times: { fajr: string; sunrise: string; dhuhr: string; asr: string; maghrib: string; isha: string }; calculation: string; updatedAt: string };
export type AccountProfile = { id: string; fullName: string; whatsapp: string; email?: string | null; gender?: string | null; birthDate?: string | null; nationality?: string | null; passportNumber?: string | null; passportExpiry?: string | null; jamaahNumber?: string | null; journey?: { departureDate: string; departureLabel: string; status: string } | null };
