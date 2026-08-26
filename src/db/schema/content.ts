import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./auth";

export const publicationStatus = pgEnum("publication_status", ["draft", "published", "archived"]);
export const packageCategory = pgEnum("package_category", ["umrah", "hajj", "halal-tour"]);
export const packageType = pgEnum("package_type", ["bintang-5", "plus", "reguler", "tour"]);
export const departureStatus = pgEnum("departure_status", ["open", "limited", "full", "closed", "coming-soon"]);
export const packageItemKind = pgEnum("package_item_kind", ["facility", "highlight", "include", "exclude", "term", "destination"]);
export const entryType = pgEnum("entry_type", ["testimonial", "gallery", "destination", "faq", "service", "homepage", "site-settings"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fileKey: text("file_key").notNull().unique(),
    url: text("url").notNull(),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text").notNull().default(""),
    uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [index("media_assets_uploaded_by_idx").on(table.uploadedBy)],
);

export const packages = pgTable(
  "packages",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    category: packageCategory("category").notNull().default("umrah"),
    type: packageType("type").notNull().default("reguler"),
    badge: text("badge"),
    summary: text("summary"),
    imageUrl: text("image_url").notNull(),
    mediaId: uuid("media_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    durationDays: integer("duration_days"),
    currency: text("currency").notNull().default("IDR"),
    status: publicationStatus("status").notNull().default("draft"),
    detailUrl: text("detail_url"),
    whatsappMessage: text("whatsapp_message").notNull(),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    sortOrder: integer("sort_order").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("packages_slug_idx").on(table.slug),
    index("packages_status_sort_idx").on(table.status, table.sortOrder),
  ],
);

export const departures = pgTable(
  "departures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
    departureDate: date("departure_date", { mode: "string" }).notNull(),
    returnDate: date("return_date", { mode: "string" }),
    manasikDate: date("manasik_date", { mode: "string" }),
    dateLabel: text("date_label").notNull(),
    airline: text("airline").notNull(),
    departureAirport: text("departure_airport").notNull(),
    arrivalAirport: text("arrival_airport"),
    price: numeric("price", { precision: 14, scale: 0 }).notNull(),
    capacity: integer("capacity"),
    availableSeats: integer("available_seats"),
    status: departureStatus("status").notNull().default("open"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (table) => [index("departures_package_date_idx").on(table.packageId, table.departureDate)],
);

export const accommodations = pgTable(
  "accommodations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    departureId: uuid("departure_id").notNull().references(() => departures.id, { onDelete: "cascade" }),
    city: text("city").notNull(),
    hotelName: text("hotel_name").notNull(),
    star: integer("star"),
    distance: text("distance"),
    nights: integer("nights"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("accommodations_departure_idx").on(table.departureId)],
);

export const packageItems = pgTable(
  "package_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
    kind: packageItemKind("kind").notNull(),
    value: text("value").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("package_items_package_kind_idx").on(table.packageId, table.kind, table.sortOrder)],
);

export const itineraryDays = pgTable(
  "itinerary_days",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
    day: integer("day").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
  },
  (table) => [uniqueIndex("itinerary_package_day_idx").on(table.packageId, table.day)],
);

export const articleCategories = pgTable("article_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ...timestamps,
});

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: jsonb("content").$type<Record<string, unknown>>().notNull(),
    categoryId: uuid("category_id").references(() => articleCategories.id, { onDelete: "set null" }),
    coverUrl: text("cover_url"),
    coverMediaId: uuid("cover_media_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    status: publicationStatus("status").notNull().default("draft"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [index("articles_status_published_idx").on(table.status, table.publishedAt)],
);

export const contentEntries = pgTable(
  "content_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: entryType("type").notNull(),
    key: text("key").notNull(),
    title: text("title").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    status: publicationStatus("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
    updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("content_entries_type_key_idx").on(table.type, table.key),
    index("content_entries_type_status_sort_idx").on(table.type, table.status, table.sortOrder),
  ],
);

export const contentDrafts = pgTable(
  "content_drafts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    updatedBy: text("updated_by").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => [uniqueIndex("content_drafts_entity_idx").on(table.entityType, table.entityId)],
);

export const slugRedirects = pgTable(
  "slug_redirects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: text("entity_type").notNull(),
    oldSlug: text("old_slug").notNull(),
    newSlug: text("new_slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("slug_redirects_type_old_idx").on(table.entityType, table.oldSlug)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    summary: text("summary").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_logs_created_idx").on(table.createdAt)],
);

export const analyticsSessions = pgTable(
  "analytics_sessions",
  {
    sessionId: text("session_id").primaryKey(),
    visitorId: text("visitor_id").notNull(),
    currentPath: text("current_path").notNull(),
    referrer: text("referrer"),
    device: text("device").notNull().default("desktop"),
    pageViews: integer("page_views").notNull().default(1),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("analytics_sessions_last_seen_idx").on(table.lastSeenAt),
    index("analytics_sessions_visitor_idx").on(table.visitorId),
  ],
);

export const analyticsPageViews = pgTable(
  "analytics_page_views",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: text("session_id").notNull().references(() => analyticsSessions.sessionId, { onDelete: "cascade" }),
    visitorId: text("visitor_id").notNull(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("analytics_page_views_created_idx").on(table.createdAt),
    index("analytics_page_views_path_created_idx").on(table.path, table.createdAt),
    index("analytics_page_views_visitor_created_idx").on(table.visitorId, table.createdAt),
  ],
);
