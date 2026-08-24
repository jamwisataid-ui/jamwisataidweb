import { and, asc, count, desc, eq } from "drizzle-orm";

import { requireDatabase } from "@/db";
import {
  accommodations,
  articles,
  auditLogs,
  contentDrafts,
  contentEntries,
  departures,
  itineraryDays,
  packageItems,
  packages,
} from "@/db/schema";

export async function getDashboardData() {
  const database = requireDatabase();
  const [packageCount, articleCount, contentCount, departureCount, recent] = await Promise.all([
    database.select({ value: count() }).from(packages),
    database.select({ value: count() }).from(articles),
    database.select({ value: count() }).from(contentEntries),
    database.select({ value: count() }).from(departures),
    database.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(8),
  ]);
  return {
    counts: {
      packages: packageCount[0]?.value ?? 0,
      articles: articleCount[0]?.value ?? 0,
      contents: contentCount[0]?.value ?? 0,
      departures: departureCount[0]?.value ?? 0,
    },
    recent,
  };
}
export async function listPackagesAdmin() {
  return requireDatabase().select().from(packages).orderBy(desc(packages.createdAt));
}

export async function getPackageAdmin(id: string) {
  const database = requireDatabase();
  const draft = await database.query.contentDrafts.findFirst({
    where: and(eq(contentDrafts.entityType, "package"), eq(contentDrafts.entityId, id)),
  });
  if (draft) return draft.payload;

  const item = await database.query.packages.findFirst({ where: eq(packages.id, id) });
  if (!item) return null;
  const [departure, children, itinerary] = await Promise.all([
    database.query.departures.findFirst({ where: eq(departures.packageId, id), orderBy: [asc(departures.departureDate)] }),
    database.select().from(packageItems).where(eq(packageItems.packageId, id)).orderBy(asc(packageItems.sortOrder)),
    database.select().from(itineraryDays).where(eq(itineraryDays.packageId, id)).orderBy(asc(itineraryDays.day)),
  ]);
  const hotels = departure
    ? await database.select().from(accommodations).where(eq(accommodations.departureId, departure.id)).orderBy(asc(accommodations.sortOrder))
    : [];
  const byKind = (kind: typeof children[number]["kind"]) => children.filter((child) => child.kind === kind).map((child) => child.value).join("\n");
  const makkah = hotels.find((hotel) => hotel.city.toLowerCase() === "makkah");
  const madinah = hotels.find((hotel) => hotel.city.toLowerCase() === "madinah");

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    packageType: item.type,
    badge: item.badge ?? "",
    summary: item.summary ?? "",
    imageUrl: item.imageUrl,
    durationDays: item.durationDays ?? 9,
    detailUrl: item.detailUrl ?? "",
    whatsappMessage: item.whatsappMessage,
    seoTitle: item.seoTitle ?? "",
    seoDescription: item.seoDescription ?? "",
    featured: item.featured,
    sortOrder: item.sortOrder,
    departureDate: departure?.departureDate ?? "",
    departureLabel: departure?.dateLabel ?? "",
    returnDate: departure?.returnDate ?? "",
    manasikDate: departure?.manasikDate ?? "",
    airline: departure?.airline ?? "",
    departureAirport: departure?.departureAirport ?? "",
    arrivalAirport: departure?.arrivalAirport ?? "",
    price: departure ? Number(departure.price) : 0,
    capacity: departure?.capacity ?? "",
    availableSeats: departure?.availableSeats ?? "",
    departureStatus: departure?.status ?? "open",
    makkahHotel: makkah?.hotelName ?? "",
    makkahStar: makkah?.star ?? 5,
    makkahDistance: makkah?.distance ?? "",
    madinahHotel: madinah?.hotelName ?? "",
    madinahStar: madinah?.star ?? 4,
    madinahDistance: madinah?.distance ?? "",
    facilities: byKind("facility"),
    highlights: byKind("highlight"),
    includes: byKind("include"),
    excludes: byKind("exclude"),
    terms: byKind("term"),
    destinations: byKind("destination"),
    itinerary: JSON.stringify(itinerary.map(({ day, title, description }) => ({ day, title, description })), null, 2),
  };
}

export async function listEntriesAdmin(type: typeof contentEntries.$inferSelect.type) {
  return requireDatabase().select().from(contentEntries).where(eq(contentEntries.type, type)).orderBy(desc(contentEntries.createdAt));
}

export async function getEntryAdmin(type: string, id: string) {
  const database = requireDatabase();
  const draft = await database.query.contentDrafts.findFirst({ where: and(eq(contentDrafts.entityType, type), eq(contentDrafts.entityId, id)) });
  if (draft) return draft.payload;
  const entry = await database.query.contentEntries.findFirst({ where: eq(contentEntries.id, id) });
  if (!entry) return null;
  const data = entry.data;
  const mapped = {
    testimonial: [String(data.youtubeId ?? ""), String(data.program ?? ""), String(data.year ?? ""), ""],
    gallery: [String(data.imageUrl ?? ""), String(data.alt ?? ""), String(data.caption ?? ""), ""],
    destination: [String(data.name ?? ""), String(data.places ?? ""), String(data.imageUrl ?? ""), ""],
    faq: [String(data.question ?? ""), String(data.answer ?? ""), String(data.scope ?? "homepage"), ""],
    service: [String(data.description ?? ""), Array.isArray(data.items) ? data.items.join("\n") : "", "", ""],
    homepage: [String(data.eyebrow ?? ""), String(data.headline ?? ""), String(data.description ?? ""), String(data.imageUrl ?? "")],
    "site-settings": [String(data.brandName ?? ""), String(data.whatsapp ?? ""), String(data.email ?? ""), String(data.address ?? "")],
  }[type] ?? ["", "", "", ""];
  return { id: entry.id, type: entry.type, key: entry.key, title: entry.title, sortOrder: entry.sortOrder, primary: mapped[0], secondary: mapped[1], tertiary: mapped[2], quaternary: mapped[3] };
}

export async function listArticlesAdmin() {
  return requireDatabase().select().from(articles).orderBy(desc(articles.updatedAt));
}

export async function getArticleAdmin(id: string) {
  const database = requireDatabase();
  const draft = await database.query.contentDrafts.findFirst({ where: and(eq(contentDrafts.entityType, "article"), eq(contentDrafts.entityId, id)) });
  if (draft) {
    const payload = draft.payload;
    return { ...payload, contentJson: JSON.stringify(payload.content ?? {}, null, 2) };
  }
  const article = await database.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!article) return null;
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    coverUrl: article.coverUrl ?? "",
    contentJson: JSON.stringify(article.content),
    seoTitle: article.seoTitle ?? "",
    seoDescription: article.seoDescription ?? "",
  };
}
