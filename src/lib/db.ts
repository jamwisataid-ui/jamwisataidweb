import "server-only";

import { cache } from "react";
import { Pool, type QueryResultRow } from "pg";

import {
  articles as fallbackArticles,
  destinations as fallbackDestinations,
  faqs as fallbackFaqs,
  gallery as fallbackGallery,
  plannerOptions as fallbackPlannerOptions,
  programs as fallbackPrograms,
  type PlannerOptionContent,
  type Program,
  type TestimonialVideo,
} from "@/data/site-content";

export type Destination = (typeof fallbackDestinations)[number];
export type GalleryItem = (typeof fallbackGallery)[number];
export type Article = (typeof fallbackArticles)[number];
export type Faq = (typeof fallbackFaqs)[number];

type ProgramRow = QueryResultRow & {
  slug: string;
  name: string;
  category: Program["category"];
  badge: string | null;
  image: string;
  departure_date: string;
  duration: string;
  airline: string;
  makkah_hotel: string;
  madinah_hotel: string;
  capacity: string;
  mentor: string;
  price: number;
  destinations: string[];
  summary: string;
};

const fallbackVideos: TestimonialVideo[] = [
  { id: "8vJae3mZooI", title: "Ust. Mega & Ust. Ahsan", subtitle: "Cerita jamaah Jam Wisata" },
  { id: "W6DJ7sZAiso", title: "Pengalaman jamaah", subtitle: "Perjalanan bersama Jam Wisata" },
  { id: "KivXY7zX4JU", title: "Keluarga Ibu Della", subtitle: "Cerita perjalanan keluarga" },
  { id: "K3qRoKJGYzc", title: "Keluarga Ibu Inggit", subtitle: "Jamaah asal Bandung" },
];

const databaseUrl = process.env.DATABASE_URL;
const globalForDb = globalThis as typeof globalThis & { jwPool?: Pool };
const pool = databaseUrl
  ? globalForDb.jwPool ?? new Pool({ connectionString: databaseUrl, max: 5 })
  : null;

if (pool && process.env.NODE_ENV !== "production") globalForDb.jwPool = pool;

const mapProgram = (row: ProgramRow): Program => ({
  slug: row.slug,
  name: row.name,
  category: row.category,
  badge: row.badge ?? undefined,
  image: row.image,
  departureDate: row.departure_date,
  duration: row.duration,
  airline: row.airline,
  makkahHotel: row.makkah_hotel,
  madinahHotel: row.madinah_hotel,
  capacity: row.capacity,
  mentor: row.mentor,
  price: row.price,
  destinations: row.destinations,
  summary: row.summary,
});

export const getPrograms = cache(async (): Promise<Program[]> => {
  if (!pool) return fallbackPrograms;
  try {
    const result = await pool.query<ProgramRow>("SELECT * FROM jw_programs WHERE is_published = true ORDER BY sort_order, name");
    return result.rows.length ? result.rows.map(mapProgram) : fallbackPrograms;
  } catch (error) {
    console.error("Jam Wisata database: gagal memuat program, menggunakan fallback lokal.", error);
    return fallbackPrograms;
  }
});

async function getCollection<T>(key: string, fallback: T[]): Promise<T[]> {
  if (!pool) return fallback;
  try {
    const result = await pool.query<{ value: unknown }>("SELECT value FROM jw_content WHERE key = $1", [key]);
    const value = result.rows[0]?.value;
    return Array.isArray(value) ? (value as T[]) : fallback;
  } catch (error) {
    console.error(`Jam Wisata database: gagal memuat koleksi ${key}, menggunakan fallback lokal.`, error);
    return fallback;
  }
}

export const getSiteContent = cache(async () => {
  const [programs, plannerRows, destinations, gallery, articles, faqs, videos] = await Promise.all([
    getPrograms(),
    getCollection<PlannerOptionContent>("planner_options", fallbackPlannerOptions.map((item) => ({ id: item.id, title: item.title, description: item.description }))),
    getCollection<Destination>("destinations", fallbackDestinations),
    getCollection<GalleryItem>("gallery", fallbackGallery),
    getCollection<Article>("articles", fallbackArticles),
    getCollection<Faq>("faqs", [...fallbackFaqs]),
    getCollection<TestimonialVideo>("testimonial_videos", fallbackVideos),
  ]);

  return { programs, plannerOptions: plannerRows, destinations, gallery, articles, faqs, videos };
});

export const getProgramBySlug = cache(async (slug: string) => {
  const programs = await getPrograms();
  return programs.find((program) => program.slug === slug);
});
