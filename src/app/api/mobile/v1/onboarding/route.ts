import { getPublishedEntries } from "@/lib/cms/public";
import { mobileData, mobileError } from "@/lib/mobile/api";

export async function GET(request: Request) {
  try {
    const entries = await getPublishedEntries("mobile-onboarding");
    const slides = entries
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((entry) => {
        const rawImageUrl = String(entry.data.imageUrl ?? "");
        return {
          id: entry.id,
          title: String(entry.data.headline ?? entry.title),
          description: String(entry.data.description ?? ""),
          imageUrl: rawImageUrl.startsWith("/")
            ? new URL(rawImageUrl, request.url).toString()
            : rawImageUrl,
          ctaLabel: String(entry.data.ctaLabel ?? "Selanjutnya"),
        };
      })
      .filter((entry) => entry.title && entry.description && entry.imageUrl)
      .slice(0, 5);
    return mobileData(slides);
  } catch (error) {
    return mobileError(error, "onboarding-list");
  }
}
