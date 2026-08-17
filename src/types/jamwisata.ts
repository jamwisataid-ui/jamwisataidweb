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
  departureMonth?: string;
  airline?: string;
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
  facilities?: string[];
  destination?: string[];
  priceFrom?: number;
  currency: "IDR";
  status: "available" | "limited" | "sold-out" | "coming-soon";
  detailUrl?: string;
  whatsappMessage: string;
};

export type ArticlePreview = {
  title: string;
  image: string;
  category: string;
  excerpt: string;
};
