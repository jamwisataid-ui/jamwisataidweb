export type TravelPackage = {
  id: string;
  slug: string;
  name: string;
  category: "umrah" | "hajj" | "halal-tour";
  packageType: "bintang-5" | "plus" | "reguler" | "tour";
  badge?: string;
  image: string;
  durationDays?: number;
  departureDate?: string;
  departureId?: string;
  departureMonth?: string;
  departures?: PackageDeparture[];
  airline?: string;
  highSpeedTrain?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  makkahHotel?: {
    name: string;
    star?: number;
    distance?: string;
  };
  madinahHotel?: {
    name: string;
    star?: number;
    distance?: string;
  };
  plusHotels?: Array<{
    destination: string;
    name: string;
    star?: number;
  }>;
  facilities?: string[];
  destination?: string[];
  priceFrom?: number;
  currency: "IDR";
  status: "available" | "limited" | "sold-out" | "coming-soon";
  detailUrl?: string;
  whatsappMessage: string;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  terms?: string[];
};

export type PackageDeparture = {
  id: string;
  departureDate: string;
  dateLabel: string;
  returnDate?: string;
  price?: number;
  quota?: number;
  remainingQuota?: number;
  status: "available" | "limited" | "sold-out" | "coming-soon";
  selectable: boolean;
};

export type ArticlePreview = {
  title: string;
  image: string;
  category: string;
  excerpt: string;
};
