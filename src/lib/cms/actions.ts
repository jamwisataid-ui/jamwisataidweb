"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { and, eq } from "drizzle-orm";

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
  slugRedirects,
} from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-session";
import {
  type ActionState,
  articleFormSchema,
  entryFormSchema,
  extractYoutubeId,
  lines,
  packageFormSchema,
  slugify,
} from "./validation";

const value = (formData: FormData, key: string) => String(formData.get(key) ?? "");

function invalidate(type: "packages" | "entries" | "articles", path?: string) {
  revalidateTag(`cms:${type}`, "max");
  revalidatePath("/");
  if (path) revalidatePath(path);
  if (type === "packages") {
    revalidatePath("/paket-umroh");
    revalidatePath("/jadwal-umroh");
    revalidatePath("/harga-umroh");
  }
  if (type === "articles") revalidatePath("/artikel");
}
async function writeAudit(actorId: string, action: string, entityType: string, entityId: string, summary: string) {
  await requireDatabase().insert(auditLogs).values({ actorId, action, entityType, entityId, summary });
}

export async function savePackageAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdminSession();
  const intent = value(formData, "intent") === "publish" ? "publish" : "draft";
  const raw = Object.fromEntries(formData.entries());
  const name = value(formData, "name").trim();
  const departureDate = value(formData, "departureDate");
  const slug = value(formData, "slug") || slugify(name);
  const departureLabel = departureDate
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${departureDate}T00:00:00Z`))
    : "";
  const whatsappMessage = `Assalamu’alaikum Jam Wisata, saya ingin konsultasi mengenai ${name}${departureLabel ? ` (keberangkatan ${departureLabel})` : ""}. Mohon informasi selengkapnya.`;
  const parsed = packageFormSchema.safeParse({
    ...raw,
    id: value(formData, "id") || randomUUID(),
    slug,
    departureLabel,
    whatsappMessage,
    featured: value(formData, "featured") === "true" || formData.get("featured") === "on",
  });
  if (!parsed.success) return { ok: false, message: "Periksa kembali data paket.", errors: parsed.error.flatten().fieldErrors };

  const database = requireDatabase();
  const data = parsed.data;
  const existing = await database.query.packages.findFirst({ where: eq(packages.id, data.id) });

  if (intent === "draft") {
    if (!existing) {
      await database.insert(packages).values({
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        type: data.packageType,
        imageUrl: data.imageUrl,
        durationDays: data.durationDays,
        status: "draft",
        whatsappMessage: data.whatsappMessage,
        createdBy: session.user.id,
        updatedBy: session.user.id,
      });
    }
    await database.insert(contentDrafts).values({
      entityType: "package",
      entityId: data.id,
      payload: data,
      updatedBy: session.user.id,
    }).onConflictDoUpdate({
      target: [contentDrafts.entityType, contentDrafts.entityId],
      set: { payload: data, updatedBy: session.user.id, updatedAt: new Date() },
    });
    await writeAudit(session.user.id, "save-draft", "package", data.id, `Draft ${data.name} disimpan`);
    return { ok: true, message: "Draft paket berhasil disimpan.", redirectTo: `/admin/paket/${data.id}` };
  }

  if (existing && existing.slug !== data.slug) {
    await database.insert(slugRedirects).values({ entityType: "package", oldSlug: existing.slug, newSlug: data.slug }).onConflictDoUpdate({
      target: [slugRedirects.entityType, slugRedirects.oldSlug],
      set: { newSlug: data.slug },
    });
  }

  await database.insert(packages).values({
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    type: data.packageType,
    badge: data.badge || null,
    summary: data.summary || null,
    imageUrl: data.imageUrl,
    durationDays: data.durationDays,
    status: "published",
    detailUrl: data.detailUrl || null,
    whatsappMessage: data.whatsappMessage,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    featured: data.featured,
    sortOrder: data.sortOrder,
    publishedAt: new Date(),
    createdBy: session.user.id,
    updatedBy: session.user.id,
  }).onConflictDoUpdate({
    target: packages.id,
    set: {
      slug: data.slug,
      name: data.name,
      category: data.category,
      type: data.packageType,
      badge: data.badge || null,
      summary: data.summary || null,
      imageUrl: data.imageUrl,
      durationDays: data.durationDays,
      status: "published",
      detailUrl: data.detailUrl || null,
      whatsappMessage: data.whatsappMessage,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      featured: data.featured,
      sortOrder: data.sortOrder,
      publishedAt: new Date(),
      updatedBy: session.user.id,
      updatedAt: new Date(),
    },
  });

  await database.delete(departures).where(eq(departures.packageId, data.id));
  await database.delete(packageItems).where(eq(packageItems.packageId, data.id));
  await database.delete(itineraryDays).where(eq(itineraryDays.packageId, data.id));

  const [departure] = await database.insert(departures).values({
    packageId: data.id,
    departureDate: data.departureDate,
    returnDate: data.returnDate || null,
    manasikDate: data.manasikDate || null,
    dateLabel: data.departureLabel,
    airline: data.airline,
    departureAirport: data.departureAirport,
    arrivalAirport: data.arrivalAirport || null,
    price: String(data.price),
    capacity: data.capacity === "" ? null : data.capacity,
    availableSeats: data.availableSeats === "" ? null : data.availableSeats,
    status: data.departureStatus,
  }).returning({ id: departures.id });

  await database.insert(accommodations).values([
    { departureId: departure.id, city: "Makkah", hotelName: data.makkahHotel, star: data.makkahStar, distance: data.makkahDistance || null, sortOrder: 0 },
    { departureId: departure.id, city: "Madinah", hotelName: data.madinahHotel, star: data.madinahStar, distance: data.madinahDistance || null, sortOrder: 1 },
  ]);

  const itemGroups = [
    ["facility", lines(data.facilities)],
    ["highlight", lines(data.highlights)],
    ["include", lines(data.includes)],
    ["exclude", lines(data.excludes)],
    ["term", lines(data.terms)],
    ["destination", lines(data.destinations)],
  ] as const;
  const itemValues = itemGroups.flatMap(([kind, entries]) => entries.map((entry, index) => ({ packageId: data.id, kind, value: entry, sortOrder: index })));
  if (itemValues.length) await database.insert(packageItems).values(itemValues);

  try {
    const itinerary = JSON.parse(data.itinerary) as Array<{ day: number; title: string; description: string }>;
    if (itinerary.length) await database.insert(itineraryDays).values(itinerary.map((day) => ({ packageId: data.id, ...day })));
  } catch {
    return { ok: false, message: "Format itinerary tidak valid." };
  }

  await database.delete(contentDrafts).where(and(eq(contentDrafts.entityType, "package"), eq(contentDrafts.entityId, data.id)));
  await writeAudit(session.user.id, "publish", "package", data.id, `${data.name} diterbitkan`);
  invalidate("packages", `/paket-umroh/${data.slug}`);
  return { ok: true, message: "Paket berhasil diterbitkan.", redirectTo: `/admin/paket/${data.id}` };
}

function entryData(type: string, data: { primary?: string; secondary?: string; tertiary?: string; quaternary?: string }) {
  if (type === "testimonial") {
    const youtubeId = extractYoutubeId(data.primary ?? "");
    if (!youtubeId) throw new Error("URL YouTube tidak valid.");
    return { youtubeId, program: data.secondary ?? "", year: data.tertiary ?? "", orientation: "portrait" };
  }
  if (type === "gallery") return { imageUrl: data.primary ?? "", alt: data.secondary ?? "", caption: data.tertiary ?? "" };
  if (type === "destination") return { name: data.primary ?? "", places: data.secondary ?? "", imageUrl: data.tertiary ?? "" };
  if (type === "faq") return { question: data.primary ?? "", answer: data.secondary ?? "", scope: data.tertiary || "homepage" };
  if (type === "service") return { description: data.primary ?? "", items: lines(data.secondary ?? "") };
  if (type === "homepage") return { eyebrow: data.primary ?? "", headline: data.secondary ?? "", description: data.tertiary ?? "", imageUrl: data.quaternary ?? "" };
  return { brandName: data.primary ?? "Jam Wisata", whatsapp: data.secondary ?? "", email: data.tertiary ?? "", address: data.quaternary ?? "" };
}

export async function saveEntryAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdminSession();
  const intent = value(formData, "intent") === "publish" ? "publish" : "draft";
  const parsed = entryFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "Periksa kembali data konten.", errors: parsed.error.flatten().fieldErrors };

  const database = requireDatabase();
  const input = parsed.data;
  const id = input.id ?? randomUUID();
  const sortOrder = 0;
  let data: Record<string, unknown>;
  try {
    data = entryData(input.type, input);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Data konten tidak valid." };
  }

  if (intent === "draft") {
    const existing = input.id ? await database.query.contentEntries.findFirst({ where: eq(contentEntries.id, input.id) }) : null;
    if (!existing) {
      await database.insert(contentEntries).values({ id, type: input.type, key: input.key, title: input.title, data, status: "draft", sortOrder, createdBy: session.user.id, updatedBy: session.user.id });
    }
    await database.insert(contentDrafts).values({ entityType: input.type, entityId: id, payload: { ...input, data }, updatedBy: session.user.id }).onConflictDoUpdate({
      target: [contentDrafts.entityType, contentDrafts.entityId],
      set: { payload: { ...input, data }, updatedBy: session.user.id, updatedAt: new Date() },
    });
    await writeAudit(session.user.id, "save-draft", input.type, id, `Draft ${input.title} disimpan`);
    return { ok: true, message: "Draft berhasil disimpan.", redirectTo: `/admin/konten/${input.type}/${id}` };
  }

  await database.insert(contentEntries).values({ id, type: input.type, key: input.key, title: input.title, data, status: "published", sortOrder, publishedAt: new Date(), createdBy: session.user.id, updatedBy: session.user.id }).onConflictDoUpdate({
    target: contentEntries.id,
    set: { key: input.key, title: input.title, data, status: "published", sortOrder, publishedAt: new Date(), updatedBy: session.user.id, updatedAt: new Date() },
  });
  await database.delete(contentDrafts).where(and(eq(contentDrafts.entityType, input.type), eq(contentDrafts.entityId, id)));
  await writeAudit(session.user.id, "publish", input.type, id, `${input.title} diterbitkan`);
  invalidate("entries");
  return { ok: true, message: "Konten berhasil diterbitkan.", redirectTo: `/admin/konten/${input.type}/${id}` };
}

export async function saveArticleAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdminSession();
  const intent = value(formData, "intent") === "publish" ? "publish" : "draft";
  const parsed = articleFormSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "Periksa kembali artikel.", errors: parsed.error.flatten().fieldErrors };
  const input = parsed.data;
  const database = requireDatabase();
  const id = input.id ?? randomUUID();
  let content: Record<string, unknown>;
  try {
    content = JSON.parse(input.contentJson) as Record<string, unknown>;
  } catch {
    return { ok: false, message: "Isi artikel tidak valid." };
  }

  if (intent === "draft") {
    const existing = input.id ? await database.query.articles.findFirst({ where: eq(articles.id, input.id) }) : null;
    if (!existing) await database.insert(articles).values({ id, slug: input.slug, title: input.title, excerpt: input.excerpt, content, coverUrl: input.coverUrl || null, status: "draft", createdBy: session.user.id, updatedBy: session.user.id });
    await database.insert(contentDrafts).values({ entityType: "article", entityId: id, payload: { ...input, content }, updatedBy: session.user.id }).onConflictDoUpdate({ target: [contentDrafts.entityType, contentDrafts.entityId], set: { payload: { ...input, content }, updatedBy: session.user.id, updatedAt: new Date() } });
    await writeAudit(session.user.id, "save-draft", "article", id, `Draft ${input.title} disimpan`);
    return { ok: true, message: "Draft artikel berhasil disimpan.", redirectTo: `/admin/artikel/${id}` };
  }

  const existing = input.id ? await database.query.articles.findFirst({ where: eq(articles.id, input.id) }) : null;
  if (existing && existing.slug !== input.slug) {
    await database.insert(slugRedirects).values({ entityType: "article", oldSlug: existing.slug, newSlug: input.slug }).onConflictDoUpdate({ target: [slugRedirects.entityType, slugRedirects.oldSlug], set: { newSlug: input.slug } });
  }
  await database.insert(articles).values({ id, slug: input.slug, title: input.title, excerpt: input.excerpt, content, coverUrl: input.coverUrl || null, status: "published", seoTitle: input.seoTitle || null, seoDescription: input.seoDescription || null, publishedAt: new Date(), createdBy: session.user.id, updatedBy: session.user.id }).onConflictDoUpdate({ target: articles.id, set: { slug: input.slug, title: input.title, excerpt: input.excerpt, content, coverUrl: input.coverUrl || null, status: "published", seoTitle: input.seoTitle || null, seoDescription: input.seoDescription || null, publishedAt: new Date(), updatedBy: session.user.id, updatedAt: new Date() } });
  await database.delete(contentDrafts).where(and(eq(contentDrafts.entityType, "article"), eq(contentDrafts.entityId, id)));
  await writeAudit(session.user.id, "publish", "article", id, `${input.title} diterbitkan`);
  invalidate("articles", `/artikel/${input.slug}`);
  return { ok: true, message: "Artikel berhasil diterbitkan.", redirectTo: `/admin/artikel/${id}` };
}

export async function setPublicationStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  const entityType = value(formData, "entityType");
  const entityId = value(formData, "entityId");
  const status = value(formData, "status") === "archived" ? "archived" : "draft";
  const database = requireDatabase();
  if (entityType === "package") {
    await database.update(packages).set({ status, updatedBy: session.user.id, updatedAt: new Date() }).where(eq(packages.id, entityId));
    invalidate("packages");
  } else if (entityType === "article") {
    await database.update(articles).set({ status, updatedBy: session.user.id, updatedAt: new Date() }).where(eq(articles.id, entityId));
    invalidate("articles");
  } else {
    await database.update(contentEntries).set({ status, updatedBy: session.user.id, updatedAt: new Date() }).where(eq(contentEntries.id, entityId));
    invalidate("entries");
  }
  await writeAudit(session.user.id, status === "archived" ? "archive" : "unpublish", entityType, entityId, `Status diubah menjadi ${status}`);
}
