import type { MetadataRoute } from "next";
import { getPublishedArticles, getPublishedPackages } from "@/lib/cms/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [umrahPackages, articles] = await Promise.all([getPublishedPackages(), getPublishedArticles()]);
  const baseUrl = "https://jamwisata.id";
  const currentDate = new Date().toISOString();

  // Core Static SEO Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/travel-umroh-bandung`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/paket-umroh`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jadwal-umroh`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/harga-umroh`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/legalitas`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/panduan-umroh`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tentang-kami`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];

  // Dynamic Package Landing Pages
  const packageRoutes: MetadataRoute.Sitemap = umrahPackages.map((pkg) => ({
    url: `${baseUrl}/paket-umroh/${pkg.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({ url: `${baseUrl}/artikel/${article.slug}`, lastModified: article.updatedAt, changeFrequency: "monthly", priority: 0.7 }));
  return [...staticRoutes, ...packageRoutes, ...articleRoutes];
}
