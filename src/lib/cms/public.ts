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

export type PublicContentType =
  | "testimonial"
  | "gallery"
  | "destination"
  | "faq"
  | "service"
  | "homepage"
  | "site-settings";

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

const queryPackages = unstable_cache(
  async (): Promise<TravelPackage[]> => {
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

    return packageRows.map((item) => {
      const departure = departureRows.find((candidate) => candidate.packageId === item.id);
      const packageHotelRows = departure ? hotelRows.filter((hotel) => hotel.departureId === departure.id) : [];
      const byKind = (kind: typeof itemRows[number]["kind"]) =>
        itemRows.filter((entry) => entry.packageId === item.id && entry.kind === kind).map((entry) => entry.value);
      const makkah = packageHotelRows.find((hotel) => hotel.city.toLowerCase() === "makkah");
      const madinah = packageHotelRows.find((hotel) => hotel.city.toLowerCase() === "madinah");

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
        departureMonth: departure?.departureDate.slice(0, 7),
        airline: departure?.airline,
        departureAirport: departure?.departureAirport,
        arrivalAirport: departure?.arrivalAirport ?? undefined,
        makkahHotel: makkah ? { name: makkah.hotelName, star: makkah.star ?? undefined, distance: makkah.distance ?? undefined } : undefined,
        madinahHotel: madinah ? { name: madinah.hotelName, star: madinah.star ?? undefined, distance: madinah.distance ?? undefined } : undefined,
        facilities: byKind("facility"),
        highlights: byKind("highlight"),
        includes: byKind("include"),
        excludes: byKind("exclude"),
        terms: byKind("term"),
        destination: byKind("destination"),
        itinerary: itineraryRows.filter((day) => day.packageId === item.id).map((day) => ({ day: day.day, title: day.title, description: day.description })),
        priceFrom: departure ? Number(departure.price) : undefined,
        currency: "IDR" as const,
        status: departure?.status === "limited" ? "limited" as const : departure?.status === "full" || departure?.status === "closed" ? "sold-out" as const : departure?.status === "coming-soon" ? "coming-soon" as const : "available" as const,
        detailUrl: item.detailUrl ?? undefined,
        whatsappMessage: item.whatsappMessage,
      } satisfies TravelPackage;
    });
  },
  ["cms-published-packages"],
  { tags: ["cms:packages"], revalidate: 3600 },
);

export const getPublishedPackages = cache(queryPackages);

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
