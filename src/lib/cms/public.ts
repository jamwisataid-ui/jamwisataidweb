import { cache } from "react";
import { unstable_cache } from "next/cache";
import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import {
  accommodations,
  articles,
  contentEntries,
  departures,
  itineraryDays,
  packageItems,
  packages,
} from "@/db/schema";
import { umrahPackages } from "@/data/jamwisata";
import type { TravelPackage } from "@/types/jamwisata";
import { filterPackagesByCategory, type ManagedPackageCategory } from "./package-category";
import { isDepartureSelectable } from "./departure-availability";

export { packagePublicPath } from "./package-category";

export type PublicContentType =
  | "testimonial"
  | "gallery"
  | "destination"
  | "faq"
  | "service"
  | "homepage"
  | "site-settings"
  | "mobile-onboarding";

export type PublicContentEntry = {
  id: string;
  key: string;
  title: string;
  data: Record<string, unknown>;
  sortOrder: number;
};

export type PublicArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: Record<string, unknown>;
  coverUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

async function queryPackages(): Promise<TravelPackage[]> {
    if (!db) return umrahPackages;

    const packageRows = await db
      .select()
      .from(packages)
      .where(eq(packages.status, "published"))
      .orderBy(desc(packages.createdAt));

    if (!packageRows.length) return [];
    const ids = packageRows.map((item) => item.id);
    const [departureRows, itemRows, itineraryRows] = await Promise.all([
      db.select().from(departures).where(inArray(departures.packageId, ids)).orderBy(asc(departures.departureDate)),
      db.select().from(packageItems).where(inArray(packageItems.packageId, ids)).orderBy(asc(packageItems.sortOrder)),
      db.select().from(itineraryDays).where(inArray(itineraryDays.packageId, ids)).orderBy(asc(itineraryDays.day)),
    ]);

    const departureIds = departureRows.map((item) => item.id);
    const hotelRows = departureIds.length
      ? await db.select().from(accommodations).where(inArray(accommodations.departureId, departureIds)).orderBy(asc(accommodations.sortOrder))
      : [];

    const todayJakarta = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    return packageRows.map((item) => {
      const packageDepartures = departureRows.filter((candidate) => candidate.packageId === item.id);
      const futureDepartures = packageDepartures.filter((candidate) => candidate.departureDate >= todayJakarta && candidate.status !== "closed");
      const selectableDepartures = futureDepartures.filter(isDepartureSelectable);
      const departure = selectableDepartures[0] ?? futureDepartures[0] ?? packageDepartures.at(-1);
      const packageHotelRows = departure ? hotelRows.filter((hotel) => hotel.departureId === departure.id) : [];
      const byKind = (kind: typeof itemRows[number]["kind"]) =>
        itemRows.filter((entry) => entry.packageId === item.id && entry.kind === kind).map((entry) => entry.value);
      const makkah = packageHotelRows.find((hotel) => hotel.city.toLowerCase() === "makkah");
      const madinah = packageHotelRows.find((hotel) => hotel.city.toLowerCase() === "madinah");
      const plusHotels = item.type === "plus"
        ? packageHotelRows.filter((hotel) => hotel.sortOrder >= 2).map((hotel) => ({ destination: hotel.city, name: hotel.hotelName, star: hotel.star ?? undefined }))
        : [];
      const publicDepartures = futureDepartures.map((candidate) => ({
        id: candidate.id,
        departureDate: candidate.departureDate,
        dateLabel: candidate.dateLabel,
        returnDate: candidate.returnDate ?? undefined,
        price: Number(candidate.price),
        quota: candidate.capacity ?? undefined,
        remainingQuota: candidate.availableSeats ?? undefined,
        status: !isDepartureSelectable(candidate) && candidate.status !== "coming-soon" ? "sold-out" as const : candidate.status === "limited" ? "limited" as const : candidate.status === "coming-soon" ? "coming-soon" as const : "available" as const,
        selectable: isDepartureSelectable(candidate),
      }));
      const activePrices = selectableDepartures.map((candidate) => Number(candidate.price)).filter(Number.isFinite);
      const packageStatus = selectableDepartures.some((candidate) => candidate.status === "open")
        ? "available" as const
        : selectableDepartures.some((candidate) => candidate.status === "limited")
          ? "limited" as const
          : futureDepartures.some((candidate) => candidate.status === "coming-soon")
            ? "coming-soon" as const
            : "sold-out" as const;

      return {
        id: item.id,
        slug: item.slug,
        name: item.name,
        category: item.category,
        packageType: item.type,
        badge: item.badge ?? undefined,
        image: item.imageUrl,
        durationDays: item.durationDays ?? undefined,
        departureDate: departure?.dateLabel,
        departureId: departure?.id,
        departureMonth: departure?.departureDate.slice(0, 7),
        departures: publicDepartures,
        airline: departure?.airline,
        highSpeedTrain: departure?.highSpeedTrain ?? undefined,
        departureAirport: departure?.departureAirport,
        arrivalAirport: departure?.arrivalAirport ?? undefined,
        makkahHotel: makkah ? { name: makkah.hotelName, star: makkah.star ?? undefined, distance: makkah.distance ?? undefined } : undefined,
        madinahHotel: madinah ? { name: madinah.hotelName, star: madinah.star ?? undefined, distance: madinah.distance ?? undefined } : undefined,
        plusHotels,
        facilities: byKind("facility"),
        highlights: byKind("highlight"),
        includes: byKind("include"),
        excludes: byKind("exclude"),
        terms: byKind("term"),
        destination: byKind("destination"),
        itinerary: itineraryRows.filter((day) => day.packageId === item.id).map((day) => ({ day: day.day, title: day.title, description: day.description })),
        priceFrom: activePrices.length ? Math.min(...activePrices) : departure ? Number(departure.price) : undefined,
        currency: "IDR" as const,
        status: packageStatus,
        detailUrl: item.detailUrl ?? undefined,
        whatsappMessage: item.whatsappMessage,
      } satisfies TravelPackage;
    });
}

export const getPublishedPackages = cache(queryPackages);

export type PublicPackageCategory = ManagedPackageCategory;

export const getPublishedPackagesByCategory = cache(async (category: PublicPackageCategory) => {
  const published = await getPublishedPackages();
  return filterPackagesByCategory(published, category);
});

const queryEntries = unstable_cache(
  async (type: PublicContentType): Promise<PublicContentEntry[]> => {
    if (!db) return [];
    const rows = await db
      .select({
        id: contentEntries.id,
        key: contentEntries.key,
        title: contentEntries.title,
        data: contentEntries.data,
        sortOrder: contentEntries.sortOrder,
      })
      .from(contentEntries)
      .where(and(eq(contentEntries.type, type), eq(contentEntries.status, "published")))
      .orderBy(desc(contentEntries.createdAt));

    return rows;
  },
  ["cms-published-entries"],
  { tags: ["cms:entries"], revalidate: 3600 },
);

export const getPublishedEntries = cache(queryEntries);

const queryArticles = unstable_cache(
  async (): Promise<PublicArticle[]> => {
    if (!db) return [];
    return db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        excerpt: articles.excerpt,
        content: articles.content,
        coverUrl: articles.coverUrl,
        seoTitle: articles.seoTitle,
        seoDescription: articles.seoDescription,
        publishedAt: articles.publishedAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt));
  },
  ["cms-published-articles"],
  { tags: ["cms:articles"], revalidate: 3600 },
);

export const getPublishedArticles = cache(queryArticles);

export const getPublishedArticleBySlug = cache(async (slug: string) => {
  const list = await getPublishedArticles();
  return list.find((article) => article.slug === slug) ?? null;
});
