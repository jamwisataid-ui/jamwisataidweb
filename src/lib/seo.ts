export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jamwisata.id";

/**
 * Memastikan URL gambar selalu bertipe absolut (https://jamwisata.id/...)
 * dan menangani baik relative path (/images/...) maupun direct CDN/UploadThing URL.
 */
export function resolveAbsoluteImageUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl || typeof pathOrUrl !== "string") {
    return `${SITE_URL}/opengraph-image`;
  }

  const trimmed = pathOrUrl.trim();

  // Jika sudah merupakan URL absolut (http:// atau https://)
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // Jika relative path
  const sanitizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${SITE_URL}${sanitizedPath}`;
}

export const defaultOpenGraphImages = [
  {
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: "Jam Wisata - Travel Umroh Terpercaya & Berlandaskan Sunnah Bandung",
    type: "image/png",
  },
];

export const defaultTwitterImages = [
  {
    url: `${SITE_URL}/twitter-image`,
    width: 1200,
    height: 630,
    alt: "Jam Wisata - Travel Umroh Terpercaya & Berlandaskan Sunnah Bandung",
  },
];
